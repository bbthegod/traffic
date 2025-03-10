package repository

import (
	"context"
	"errors"
	"net/http"
	"strings"
	"time"
	"ts-backend/package/config"
	"ts-backend/package/domain/model"
	"ts-backend/package/usecase/repository"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type violationRepository struct {
	violationCollection *mongo.Collection
}

type ViolationGroup struct {
	Id    int `json:"_id,omitempty" bson:"_id,omitempty"`
	Count int `json:"count,omitempty" bson:"count,omitempty"`
}

func NewViolationRepository(db *mongo.Client) repository.ViolationRepository {
	env := config.GetENV()
	collection := db.Database(env.DbName).Collection("violations")
	return &violationRepository{collection}
}

func (repository *violationRepository) Report() (*model.ViolationReport, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var arr [12]int
	for i := 0; i < 12; i++ {
		arr[i] = 0
	}

	cursor, err := repository.violationCollection.Aggregate(ctx, []bson.M{
		{"$group": bson.M{
			"_id":   bson.M{"$month": "$violationDate"},
			"count": bson.M{"$sum": 1},
		}},
	})
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	for cursor.Next(ctx) {
		var v *ViolationGroup
		if err := cursor.Decode(&v); err != nil {
			return nil, http.StatusInternalServerError, err
		}
		arr[v.Id-1] = v.Count
	}

	var locationReport []model.ViolationLocationReport
	cursor2, err := repository.violationCollection.Aggregate(ctx, []bson.M{
		{"$group": bson.M{
			"_id":   bson.M{"locationCity": "$locationCity", "locationDistrict": "$locationDistrict"},
			"count": bson.M{"$sum": 1},
		}},
	})
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	for cursor2.Next(ctx) {
		var v *model.ViolationLocationReport
		if err := cursor2.Decode(&v); err != nil {
			return nil, http.StatusInternalServerError, err
		}
		locationReport = append(locationReport, *v)
	}

	var result model.ViolationReport
	result.Month = arr
	result.Location = locationReport

	return &result, 0, nil
}

func (repository *violationRepository) List(skip int64, limit int64, search string, sort string, timeStart string, timeEnd string, location string) ([]*model.Violation, int64, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{}
	if search != "" {
		filter = bson.M{"driverName": bson.M{"$regex": search, "$options": "im"}}
	}
	if timeStart != "" && timeEnd != "" {
		parsedTimeStart, err := time.Parse(time.RFC3339, string(timeStart))
		if err != nil {
			return nil, 0, http.StatusInternalServerError, err
		}
		parsedTimeEnd, err := time.Parse(time.RFC3339, string(timeEnd))
		if err != nil {
			return nil, 0, http.StatusInternalServerError, err
		}
		filter["violationDate"] = bson.M{"$gte": parsedTimeStart, "$lt": parsedTimeEnd}
	}
	if location != "" {
		filter["locationDistrict"] = location
	}
	opts := options.Find().SetLimit(limit).SetSkip(skip)
	if sort != "" {
		if strings.Contains(sort, "-") {
			opts.SetSort(bson.D{{Key: sort[1:], Value: -1}})
		} else {
			opts.SetSort(bson.D{{Key: sort, Value: 1}})
		}
	}
	cursor, err := repository.violationCollection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, http.StatusInternalServerError, err
	}
	count, err := repository.violationCollection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, http.StatusInternalServerError, err
	}
	var result []*model.Violation

	for cursor.Next(ctx) {
		var violation *model.Violation
		if err := cursor.Decode(&violation); err != nil {
			return nil, 0, http.StatusInternalServerError, err
		}
		result = append(result, violation)
	}
	return result, count, 0, nil
}

func (repository *violationRepository) GetOne(id primitive.ObjectID) (*model.Violation, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var projection = bson.M{"$project": bson.M{
		"officerId._id":             1,
		"officerId.name":            1,
		"officerId.position":        1,
		"officerId.policeId":        1,
		"plate":                     1,
		"driverName":                1,
		"driverDob":                 1,
		"driverNationality":         1,
		"driverAddress":             1,
		"driverJob":                 1,
		"driverId":                  1,
		"driverIdDate":              1,
		"driverIdAddress":           1,
		"vehicleName":               1,
		"violationDate":             1,
		"violationType._id":         1,
		"violationType.name":        1,
		"violationType.vehicleType": 1,
		"locationStreet":            1,
		"locationDistrict":          1,
		"locationCity":              1,
		"officerComment":            1,
		"driverComment":             1,
		"itemsKepp":                 1,
		"penalty":                   1,
		"status":                    1,
	}}

	cursor, err := repository.violationCollection.Aggregate(ctx, []bson.M{
		{"$lookup": bson.M{
			"from":         "users",
			"localField":   "officerId",
			"foreignField": "_id",
			"as":           "officerId",
		}},
		{"$unwind": "$officerId"},
		{"$lookup": bson.M{
			"from":         "violationTypes",
			"localField":   "violationType",
			"foreignField": "_id",
			"as":           "violationType",
		}},
		{"$match": bson.M{"_id": id}},
		projection,
	})
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	var result []*model.Violation

	for cursor.Next(ctx) {
		var violation *model.Violation
		if err := cursor.Decode(&violation); err != nil {
			return nil, http.StatusInternalServerError, err
		}
		result = append(result, violation)
	}

	if len(result) > 0 {
		return result[0], http.StatusOK, nil
	} else {
		return nil, http.StatusNotFound, nil
	}
}

func (repository *violationRepository) Create(violation *model.Violation) (*model.Violation, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	violation.Id = primitive.NewObjectID()

	_, err := repository.violationCollection.InsertOne(ctx, violation)
	if err != nil {
		code := err.(mongo.CommandError).Code
		if code == 11000 {
			return nil, http.StatusConflict, errors.New("violation is already exists")
		}
		return nil, http.StatusInternalServerError, err
	}

	return violation, http.StatusOK, nil
}

func (repository *violationRepository) Update(id primitive.ObjectID, violation *model.Violation) (*model.Violation, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	update := bson.M{
		"officerId":         violation.OfficerId,
		"plate":             violation.Plate,
		"driverName":        violation.DriverName,
		"driverDob":         violation.DriverDOB,
		"driverNationality": violation.DriverNationality,
		"driverAddress":     violation.DriverAddress,
		"driverJob":         violation.DriverJob,
		"driverId":          violation.DriverId,
		"driverIdDate":      violation.DriverIdDate,
		"driverIdAddress":   violation.DriverIdAddress,
		"vehicleName":       violation.VehicleName,
		"violationDate":     violation.ViolationDate,
		"violationType":     violation.ViolationType,
		"locationStreet":    violation.LocationStreet,
		"locationDistrict":  violation.LocationDistrict,
		"locationCity":      violation.LocationCity,
		"officerComment":    violation.OfficerComment,
		"driverComment":     violation.DriverComment,
		"itemsKepp":         violation.ItemsKepp,
		"penalty":           violation.Penalty,
		"status":            violation.Status,
	}

	var result *model.Violation
	updated, err := repository.violationCollection.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": update})
	if updated.MatchedCount == 1 {
		err := repository.violationCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&result)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
	}
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}
	return result, http.StatusOK, nil
}

func (repository *violationRepository) Delete(id primitive.ObjectID) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	deleted, err := repository.violationCollection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return http.StatusInternalServerError, err
	}
	if deleted.DeletedCount != 1 {
		return http.StatusInternalServerError, errors.New("deleted failed")
	}
	return http.StatusOK, nil
}

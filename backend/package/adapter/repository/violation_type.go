package repository

import (
	"context"
	"errors"
	"net/http"
	"time"
	"ts-backend/package/config"
	"ts-backend/package/domain/model"
	"ts-backend/package/usecase/repository"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type violationTypeRepository struct {
	violationTypeCollection *mongo.Collection
}

func NewViolationTypeRepository(db *mongo.Client) repository.ViolationTypeRepository {
	env := config.GetENV()
	collection := db.Database(env.DbName).Collection("violationTypes")
	return &violationTypeRepository{collection}
}

func (repository *violationTypeRepository) All() ([]*model.ViolationType, int64, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{}
	opts := options.Find()
	cursor, err := repository.violationTypeCollection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, http.StatusInternalServerError, err
	}
	count, err := repository.violationTypeCollection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, http.StatusInternalServerError, err
	}
	var result []*model.ViolationType

	for cursor.Next(ctx) {
		var violationType *model.ViolationType
		if err := cursor.Decode(&violationType); err != nil {
			return nil, 0, http.StatusInternalServerError, err
		}
		result = append(result, violationType)
	}
	return result, count, 0, nil
}

func (repository *violationTypeRepository) List(skip int64, limit int64, search string) ([]*model.ViolationType, int64, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{}
	if search != "" {
		filter = bson.M{"content": bson.M{"$regex": search, "$options": "im"}}
	}
	opts := options.Find().SetLimit(limit).SetSkip(skip)
	cursor, err := repository.violationTypeCollection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, http.StatusInternalServerError, err
	}
	count, err := repository.violationTypeCollection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, http.StatusInternalServerError, err
	}
	var result []*model.ViolationType

	for cursor.Next(ctx) {
		var violationType *model.ViolationType
		if err := cursor.Decode(&violationType); err != nil {
			return nil, 0, http.StatusInternalServerError, err
		}
		result = append(result, violationType)
	}
	return result, count, 0, nil
}

func (repository *violationTypeRepository) GetOne(id primitive.ObjectID) (*model.ViolationType, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var result *model.ViolationType
	err := repository.violationTypeCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&result)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	return result, http.StatusOK, nil
}

func (repository *violationTypeRepository) Create(violationType *model.ViolationType) (*model.ViolationType, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	violationType.Id = primitive.NewObjectID()

	_, err := repository.violationTypeCollection.InsertOne(ctx, violationType)
	if err != nil {
		code := err.(mongo.CommandError).Code
		if code == 11000 {
			return nil, http.StatusConflict, errors.New("violationType is already exists")
		}
		return nil, http.StatusInternalServerError, err
	}

	return violationType, http.StatusOK, nil
}

func (repository *violationTypeRepository) Update(id primitive.ObjectID, violationType *model.ViolationType) (*model.ViolationType, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	update := bson.M{
		"name":        violationType.Name,
		"details":     violationType.Details,
		"amountFrom":  violationType.AmountFrom,
		"amountTo":    violationType.AmountTo,
		"vehicleType": violationType.VehicleType,
		"status":      violationType.Status,
	}

	var result *model.ViolationType
	updated, err := repository.violationTypeCollection.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": update})
	if updated.MatchedCount == 1 {
		err := repository.violationTypeCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&result)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
	}
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}
	return result, http.StatusOK, nil
}

func (repository *violationTypeRepository) Delete(id primitive.ObjectID) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	deleted, err := repository.violationTypeCollection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return http.StatusInternalServerError, err
	}
	if deleted.DeletedCount != 1 {
		return http.StatusInternalServerError, errors.New("deleted failed")
	}
	return http.StatusOK, nil
}

package repository

import (
	"context"
	"errors"
	"net/http"
	"time"
	"ts-backend/package/common"
	"ts-backend/package/config"
	"ts-backend/package/domain/model"
	"ts-backend/package/usecase/repository"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type userRepository struct {
	userCollection *mongo.Collection
}

func NewUserRepository(db *mongo.Client) repository.UserRepository {
	env := config.GetENV()
	collection := db.Database(env.DbName).Collection("users")
	_, err := collection.Indexes().CreateOne(context.TODO(), mongo.IndexModel{
		Keys:    bson.M{"username": 1},
		Options: options.Index().SetUnique(true),
	})
	if err != nil {
		panic(err)
	}
	return &userRepository{collection}
}

func (repository *userRepository) All() ([]*model.User, int64, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{}
	opts := options.Find()
	cursor, err := repository.userCollection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, http.StatusInternalServerError, err
	}
	count, err := repository.userCollection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, http.StatusInternalServerError, err
	}
	var result []*model.User

	for cursor.Next(ctx) {
		var user *model.User
		if err := cursor.Decode(&user); err != nil {
			return nil, 0, http.StatusInternalServerError, err
		}
		result = append(result, user)
	}
	return result, count, 0, nil
}

func (repository *userRepository) List(skip int64, limit int64, search string) ([]*model.User, int64, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{}
	if search != "" {
		filter = bson.M{"username": bson.M{"$regex": search, "$options": "im"}}
	}
	opts := options.Find().SetLimit(limit).SetSkip(skip)
	cursor, err := repository.userCollection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, http.StatusInternalServerError, err
	}
	count, err := repository.userCollection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, http.StatusInternalServerError, err
	}
	var result []*model.User

	for cursor.Next(ctx) {
		var user *model.User
		if err := cursor.Decode(&user); err != nil {
			return nil, 0, http.StatusInternalServerError, err
		}
		result = append(result, user)
	}
	return result, count, 0, nil
}

func (repository *userRepository) GetOne(id primitive.ObjectID) (*model.User, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var result *model.User
	err := repository.userCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&result)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	return result, http.StatusOK, nil
}

func (repository *userRepository) Create(user *model.User) (*model.User, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	user.Id = primitive.NewObjectID()
	password, err := common.EncodePassword(user.Password)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}
	user.Password = password

	_, err = repository.userCollection.InsertOne(ctx, user)
	if err != nil {
		// code := err.(mongo.WriteException).WriteErrors[0].Code
		// if code == 11000 {
		// 	return nil, http.StatusConflict, errors.New("user is already exists")
		// }
		return nil, http.StatusInternalServerError, err
	}

	return user, http.StatusOK, nil
}

func (repository *userRepository) Update(id primitive.ObjectID, user *model.User) (*model.User, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	update := bson.M{
		"policeId": user.PoliceId,
		"username": user.Username,
		"name":     user.Name,
		"position": user.Position,
		"role":     user.Role,
		"status":   user.Status,
	}

	if user.Password != "" {
		password, err := common.EncodePassword(user.Password)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		update["password"] = password
	}

	var result *model.User
	updated, err := repository.userCollection.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": update})
	if updated.MatchedCount == 1 {
		err := repository.userCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&result)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
	}
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}
	return result, http.StatusOK, nil
}

func (repository *userRepository) Delete(id primitive.ObjectID) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	deleted, err := repository.userCollection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return http.StatusInternalServerError, err
	}
	if deleted.DeletedCount != 1 {
		return http.StatusInternalServerError, errors.New("deleted failed")
	}
	return http.StatusOK, nil
}

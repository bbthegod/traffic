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
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type authRepository struct {
	userCollection *mongo.Collection
}

func NewAuthRepository(db *mongo.Client) repository.AuthRepository {
	env := config.GetENV()
	return &authRepository{db.Database(env.DbName).Collection("users")}
}

func (repository *authRepository) Login(auth *model.User) (*model.User, *string, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user *model.User
	err := repository.userCollection.FindOne(ctx, bson.M{"username": auth.Username}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil, http.StatusUnauthorized, errors.New("user-not-found")
		}
		return nil, nil, http.StatusInternalServerError, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(auth.Password))
	if err != nil {
		return nil, nil, http.StatusUnauthorized, errors.New("username-or-password-incorrect")
	}

	if user.Status != "ACTIVE" {
		return nil, nil, http.StatusUnauthorized, errors.New("user-not-active")
	}

	token, err := common.EncodeToken(user)
	if err != nil {
		return nil, nil, http.StatusInternalServerError, err
	}

	return user, token, http.StatusOK, nil
}

func (repository *authRepository) ChangePassword(username string, oldPassword string, newPassword string) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user *model.User
	err := repository.userCollection.FindOne(ctx, bson.M{"username": username}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return http.StatusNotFound, errors.New("user-not-found")
		}
		return http.StatusInternalServerError, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(oldPassword))
	if err != nil {
		return http.StatusUnauthorized, errors.New("username-or-password-incorrect")
	}

	password, err := common.EncodePassword(newPassword)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	update := bson.M{
		"password": password,
	}

	updated, err := repository.userCollection.UpdateOne(ctx, bson.M{"_id": user.Id}, bson.M{"$set": update})
	if updated.MatchedCount != 1 {
		return http.StatusNotFound, errors.New("user-not-found")
	}
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, nil
}

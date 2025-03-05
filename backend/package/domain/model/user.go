package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	Id       primitive.ObjectID `json:"_id" bson:"_id"`
	PoliceId string             `json:"policeId,omitempty" bson:"policeId,omitempty"`
	Username string             `json:"username,omitempty" bson:"username,omitempty"`
	Name     string             `json:"name,omitempty" bson:"name,omitempty"`
	Position string             `json:"position,omitempty" bson:"position,omitempty"`
	Password string             `json:"password,omitempty" bson:"password,omitempty"`
	Role     string             `json:"role,omitempty" bson:"role,omitempty"`
	Status   string             `json:"status,omitempty" bson:"status,omitempty"`
}

type UserBodyParams struct {
	PoliceId string `json:"PoliceId,omitempty" bson:"PoliceId,omitempty"`
	Username string `json:"username,omitempty" bson:"username,omitempty"`
	Name     string `json:"name,omitempty" bson:"name,omitempty"`
	Position string `json:"position,omitempty" bson:"position,omitempty"`
	Password string `json:"password,omitempty" bson:"password,omitempty"`
	Role     string `json:"role,omitempty" bson:"role,omitempty"`
	Status   string `json:"status" bson:"status,omitempty"`
}

package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ViolationType struct {
	Id          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Name        string             `json:"name,omitempty" bson:"name,omitempty"`
	Details     string             `json:"details,omitempty" bson:"details,omitempty"`
	AmountFrom  int                `json:"amountFrom,omitempty" bson:"amountFrom,omitempty"`
	AmountTo    int                `json:"amountTo,omitempty" bson:"amountTo,omitempty"`
	VehicleType string             `json:"vehicleType,omitempty" bson:"vehicleType,omitempty"`
	Status      string             `json:"status,omitempty" bson:"status,omitempty"`
}

type ViolationTypeBodyParams struct {
	Name        string `json:"name" bson:"name,omitempty"`
	Details     string `json:"details" bson:"details,omitempty"`
	AmountFrom  int    `json:"amountFrom" bson:"amountFrom,omitempty"`
	AmountTo    int    `json:"amountTo" bson:"amountTo,omitempty"`
	VehicleType string `json:"vehicleType" bson:"vehicleType,omitempty"`
	Status      string `json:"status" bson:"status,omitempty"`
}

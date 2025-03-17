package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Violation struct {
	Id                primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	OfficerId         interface{}        `json:"officerId,omitempty" bson:"officerId,omitempty"`
	Plate             string             `json:"plate,omitempty" bson:"plate,omitempty"`
	DriverName        string             `json:"driverName,omitempty" bson:"driverName,omitempty"`
	DriverDOB         string             `json:"driverDob,omitempty" bson:"driverDob,omitempty"`
	DriverNationality string             `json:"driverNationality,omitempty" bson:"driverNationality,omitempty"`
	DriverAddress     string             `json:"driverAddress,omitempty" bson:"driverAddress,omitempty"`
	DriverJob         string             `json:"driverJob,omitempty" bson:"driverJob,omitempty"`
	DriverId          string             `json:"driverId,omitempty" bson:"driverId,omitempty"`
	DriverIdDate      string             `json:"driverIdDate,omitempty" bson:"driverIdDate,omitempty"`
	DriverIdAddress   string             `json:"driverIdAddress,omitempty" bson:"driverIdAddress,omitempty"`
	VehicleName       string             `json:"vehicleName,omitempty" bson:"vehicleName,omitempty"`
	ViolationDate     primitive.DateTime `json:"violationDate,omitempty" bson:"violationDate,omitempty"`
	ViolationType     interface{}        `json:"violationType,omitempty" bson:"violationType,omitempty"`
	LocationStreet    string             `json:"locationStreet,omitempty" bson:"locationStreet,omitempty"`
	LocationDistrict  string             `json:"locationDistrict,omitempty" bson:"locationDistrict,omitempty"`
	LocationCity      string             `json:"locationCity,omitempty" bson:"locationCity,omitempty"`
	OfficerComment    string             `json:"officerComment,omitempty" bson:"officerComment,omitempty"`
	DriverComment     string             `json:"driverComment,omitempty" bson:"driverComment,omitempty"`
	ItemsKeep         string             `json:"itemsKeep,omitempty" bson:"itemsKeep,omitempty"`
	Penalty           int                `json:"penalty,omitempty" bson:"penalty,omitempty"`
	Status            string             `json:"status,omitempty" bson:"status,omitempty"`
}

type ViolationReport struct {
	Month    [12]int                   `json:"month,omitempty" bson:"month,omitempty"`
	Location []ViolationLocationReport `json:"location,omitempty" bson:"location,omitempty"`
}

type ViolationLocationReport struct {
	Id    interface{} `json:"_id,omitempty" bson:"_id,omitempty"`
	Count int         `json:"count,omitempty" bson:"count,omitempty"`
}

type ViolationBodyParams struct {
	OfficerId         primitive.ObjectID   `json:"officerId" bson:"officerId,omitempty"`
	Plate             string               `json:"plate" bson:"plate,omitempty"`
	DriverName        string               `json:"driverName" bson:"driverName,omitempty"`
	DriverDOB         string               `json:"driverDob" bson:"driverDob,omitempty"`
	DriverNationality string               `json:"driverNationality" bson:"driverNationality,omitempty"`
	DriverAddress     string               `json:"driverAddress" bson:"driverAddress,omitempty"`
	DriverJob         string               `json:"driverJob" bson:"driverJob,omitempty"`
	DriverId          string               `json:"driverId" bson:"driverId,omitempty"`
	DriverIdDate      string               `json:"driverIdDate" bson:"driverIdDate,omitempty"`
	DriverIdAddress   string               `json:"driverIdAddress" bson:"driverIdAddress,omitempty"`
	VehicleName       string               `json:"vehicleName" bson:"vehicleName,omitempty"`
	ViolationDate     primitive.DateTime   `json:"violationDate" bson:"violationDate,omitempty"`
	ViolationType     []primitive.ObjectID `json:"violationType" bson:"violationType,omitempty"`
	LocationStreet    string               `json:"locationStreet" bson:"locationStreet,omitempty"`
	LocationDistrict  string               `json:"locationDistrict" bson:"locationDistrict,omitempty"`
	LocationCity      string               `json:"locationCity" bson:"locationCity,omitempty"`
	OfficerComment    string               `json:"officerComment" bson:"officerComment,omitempty"`
	DriverComment     string               `json:"driverComment" bson:"driverComment,omitempty"`
	ItemsKeep         string               `json:"itemsKeep" bson:"itemsKeep,omitempty"`
	Penalty           int                  `json:"penalty" bson:"penalty,omitempty"`
	Status            string               `json:"status" bson:"status,omitempty"`
}

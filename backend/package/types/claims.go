package types

import (
	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Claims struct {
	Id       primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Username string             `json:"username,omitempty"`
	Name     string             `json:"name,omitempty"`
	Role     string             `json:"role,omitempty"`
	jwt.RegisteredClaims
}

type Auth struct {
	Id       string
	Username string
	Name     string
	Role     string
}

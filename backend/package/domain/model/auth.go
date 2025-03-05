package model

type Auth struct {
	Username string `json:"username" bson:"username" validate:"required"`
	Password string `json:"password" bson:"password" validate:"required"`
}

type ChangePasswordParams struct {
	OldPassword string `json:"oldPassword" bson:"oldPassword" validate:"required"`
	NewPassword string `json:"newPassword" bson:"newPassword" validate:"required"`
}

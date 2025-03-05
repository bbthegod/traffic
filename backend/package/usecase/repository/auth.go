package repository

import "ts-backend/package/domain/model"

type AuthRepository interface {
	Login(user *model.User) (*model.User, *string, int, error)
	ChangePassword(username string, oldPassword string, newPassword string) (int, error)
}

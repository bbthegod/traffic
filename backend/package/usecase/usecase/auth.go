package usecase

import (
	"ts-backend/package/domain/model"
	"ts-backend/package/usecase/repository"
)

type authUsecase struct {
	authRepository repository.AuthRepository
}

type Auth interface {
	Login(user *model.User) (*model.User, *string, int, error)
	ChangePassword(username string, oldPassword string, newPassword string) (int, error)
}

func NewAuthUsecase(r repository.AuthRepository) Auth {
	return &authUsecase{r}
}

func (usecase *authUsecase) Login(user *model.User) (*model.User, *string, int, error) {
	user, token, code, err := usecase.authRepository.Login(user)
	return user, token, code, err
}

func (usecase *authUsecase) ChangePassword(username string, oldPassword string, newPassword string) (int, error) {
	code, err := usecase.authRepository.ChangePassword(username, oldPassword, newPassword)
	return code, err
}

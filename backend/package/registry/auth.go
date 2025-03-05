package registry

import (
	"ts-backend/package/adapter/controller"
	"ts-backend/package/adapter/repository"
	"ts-backend/package/usecase/usecase"
)

func (r *registry) NewAuthController() controller.Auth {
	authUsecase := usecase.NewAuthUsecase(
		repository.NewAuthRepository(r.db),
	)
	userUsecase := usecase.NewUserUsecase(
		repository.NewUserRepository(r.db),
	)

	return controller.NewAuthController(authUsecase, userUsecase)
}

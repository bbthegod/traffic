package registry

import (
	"ts-backend/package/adapter/controller"
	"ts-backend/package/adapter/repository"
	"ts-backend/package/usecase/usecase"
)

func (r *registry) NewUserController() controller.User {
	usecase := usecase.NewUserUsecase(
		repository.NewUserRepository(r.db),
	)

	return controller.NewUserController(usecase)
}

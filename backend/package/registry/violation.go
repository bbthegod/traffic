package registry

import (
	"ts-backend/package/adapter/controller"
	"ts-backend/package/adapter/repository"
	"ts-backend/package/usecase/usecase"
)

func (r *registry) NewViolationController() controller.Violation {
	usecase := usecase.NewViolationUsecase(
		repository.NewViolationRepository(r.db),
	)

	return controller.NewViolationController(usecase)
}

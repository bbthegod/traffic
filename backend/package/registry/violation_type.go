package registry

import (
	"ts-backend/package/adapter/controller"
	"ts-backend/package/adapter/repository"
	"ts-backend/package/usecase/usecase"
)

func (r *registry) NewViolationTypeController() controller.ViolationType {
	usecase := usecase.NewViolationTypeUsecase(
		repository.NewViolationTypeRepository(r.db),
	)

	return controller.NewViolationTypeController(usecase)
}

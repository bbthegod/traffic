package usecase

import (
	"net/http"
	"ts-backend/package/domain/model"
	"ts-backend/package/usecase/repository"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type violationTypeUsecase struct {
	violationTypeRepository repository.ViolationTypeRepository
}

type ViolationType interface {
	All() ([]*model.ViolationType, int64, int, error)
	List(skip int64, limit int64, search string) ([]*model.ViolationType, int64, int, error)
	GetOne(id primitive.ObjectID) (*model.ViolationType, int, error)
	Create(violationType *model.ViolationType) (*model.ViolationType, int, error)
	Update(id primitive.ObjectID, violationType *model.ViolationType) (*model.ViolationType, int, error)
	Delete(id primitive.ObjectID) (int, error)
}

func NewViolationTypeUsecase(r repository.ViolationTypeRepository) ViolationType {
	return &violationTypeUsecase{r}
}

func (usecase *violationTypeUsecase) All() ([]*model.ViolationType, int64, int, error) {
	res, count, code, err := usecase.violationTypeRepository.All()
	if err != nil {
		return nil, 0, code, err
	}

	return res, count, http.StatusOK, nil
}

func (usecase *violationTypeUsecase) List(skip int64, limit int64, search string) ([]*model.ViolationType, int64, int, error) {
	res, count, code, err := usecase.violationTypeRepository.List(skip, limit, search)
	if err != nil {
		return nil, 0, code, err
	}

	return res, count, http.StatusOK, nil
}

func (usecase *violationTypeUsecase) GetOne(id primitive.ObjectID) (*model.ViolationType, int, error) {
	res, code, err := usecase.violationTypeRepository.GetOne(id)
	if err != nil {
		return nil, code, err
	}

	return res, code, nil
}

func (usecase *violationTypeUsecase) Create(violationType *model.ViolationType) (*model.ViolationType, int, error) {
	res, code, err := usecase.violationTypeRepository.Create(violationType)
	if err != nil {
		return nil, code, err
	}

	return res, 0, nil
}

func (usecase *violationTypeUsecase) Update(id primitive.ObjectID, violationType *model.ViolationType) (*model.ViolationType, int, error) {
	res, code, err := usecase.violationTypeRepository.Update(id, violationType)
	if err != nil {
		return nil, code, err
	}

	return res, code, nil
}

func (usecase *violationTypeUsecase) Delete(id primitive.ObjectID) (int, error) {
	code, err := usecase.violationTypeRepository.Delete(id)
	if err != nil {
		return code, err
	}

	return code, nil
}

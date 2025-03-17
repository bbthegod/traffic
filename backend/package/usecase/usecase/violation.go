package usecase

import (
	"net/http"
	"ts-backend/package/domain/model"
	"ts-backend/package/usecase/repository"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type violationUsecase struct {
	violationRepository repository.ViolationRepository
}

type Violation interface {
	Report() (*model.ViolationReport, int, error)
	List(skip int64, limit int64, search string, sort string, timeStart string, timeEnd string, location string, policeId string) ([]*model.Violation, int64, int, error)
	GetOne(id primitive.ObjectID) (*model.Violation, int, error)
	Create(violation *model.Violation) (*model.Violation, int, error)
	Update(id primitive.ObjectID, violation *model.Violation) (*model.Violation, int, error)
	Delete(id primitive.ObjectID) (int, error)
}

func NewViolationUsecase(r repository.ViolationRepository) Violation {
	return &violationUsecase{r}
}

func (usecase *violationUsecase) Report() (*model.ViolationReport, int, error) {
	res, code, err := usecase.violationRepository.Report()
	if err != nil {
		return nil, code, err
	}

	return res, http.StatusOK, nil
}

func (usecase *violationUsecase) List(skip int64, limit int64, search string, sort string, timeStart string, timeEnd string, location string, policeId string) ([]*model.Violation, int64, int, error) {
	res, count, code, err := usecase.violationRepository.List(skip, limit, search, sort, timeStart, timeEnd, location, policeId)
	if err != nil {
		return nil, 0, code, err
	}

	return res, count, http.StatusOK, nil
}

func (usecase *violationUsecase) GetOne(id primitive.ObjectID) (*model.Violation, int, error) {
	res, code, err := usecase.violationRepository.GetOne(id)
	if err != nil {
		return nil, code, err
	}

	return res, code, nil
}

func (usecase *violationUsecase) Create(violation *model.Violation) (*model.Violation, int, error) {
	res, code, err := usecase.violationRepository.Create(violation)
	if err != nil {
		return nil, code, err
	}

	return res, 0, nil
}

func (usecase *violationUsecase) Update(id primitive.ObjectID, violation *model.Violation) (*model.Violation, int, error) {
	res, code, err := usecase.violationRepository.Update(id, violation)
	if err != nil {
		return nil, code, err
	}

	return res, code, nil
}

func (usecase *violationUsecase) Delete(id primitive.ObjectID) (int, error) {
	code, err := usecase.violationRepository.Delete(id)
	if err != nil {
		return code, err
	}

	return code, nil
}

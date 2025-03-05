package repository

import (
	"ts-backend/package/domain/model"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ViolationRepository interface {
	Report() (*model.ViolationReport, int, error)
	List(skip int64, limit int64, search string, sort string, timeStart string, timeEnd string, location string) ([]*model.Violation, int64, int, error)
	GetOne(id primitive.ObjectID) (*model.Violation, int, error)
	Create(question *model.Violation) (*model.Violation, int, error)
	Update(id primitive.ObjectID, question *model.Violation) (*model.Violation, int, error)
	Delete(id primitive.ObjectID) (int, error)
}

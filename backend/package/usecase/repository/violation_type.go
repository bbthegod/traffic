package repository

import (
	"ts-backend/package/domain/model"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ViolationTypeRepository interface {
	All() ([]*model.ViolationType, int64, int, error)
	List(skip int64, limit int64, search string) ([]*model.ViolationType, int64, int, error)
	GetOne(id primitive.ObjectID) (*model.ViolationType, int, error)
	Create(question *model.ViolationType) (*model.ViolationType, int, error)
	Update(id primitive.ObjectID, question *model.ViolationType) (*model.ViolationType, int, error)
	Delete(id primitive.ObjectID) (int, error)
}

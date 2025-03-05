package controller

import (
	"net/http"
	"ts-backend/package/common"
	"ts-backend/package/types"
	"ts-backend/package/usecase/usecase"

	"ts-backend/package/domain/model"

	"github.com/gin-gonic/gin"
)

type violationTypeController struct {
	violationTypeUsecase usecase.ViolationType
}

type ViolationType interface {
	All(c *gin.Context) error
	List(c *gin.Context) error
	GetOne(c *gin.Context) error
	Create(c *gin.Context) error
	Update(c *gin.Context) error
	Delete(c *gin.Context) error
}

func NewViolationTypeController(uq usecase.ViolationType) ViolationType {
	return &violationTypeController{uq}
}

func (controller *violationTypeController) All(ctx *gin.Context) error {
	res, count, code, err := controller.violationTypeUsecase.All()
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res, Count: count})
	return nil
}

func (controller *violationTypeController) List(ctx *gin.Context) error {
	query, err := common.GetQueries(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return err
	}

	res, count, code, err := controller.violationTypeUsecase.List(query.Skip, query.Limit, query.Search)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res, Count: count, Limit: query.Limit, Skip: query.Skip})
	return nil
}

func (controller *violationTypeController) GetOne(ctx *gin.Context) error {
	id, err := common.GetIDParam(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return nil
	}

	res, code, err := controller.violationTypeUsecase.GetOne(id)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res})
	return nil
}

func (controller *violationTypeController) Create(ctx *gin.Context) error {
	var params model.ViolationTypeBodyParams

	err := common.GetBodyParams(ctx, &params)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return err
	}

	violationType := new(model.ViolationType)
	violationType.Name = params.Name
	violationType.AmountFrom = params.AmountFrom
	violationType.AmountTo = params.AmountTo
	violationType.VehicleType = params.VehicleType
	violationType.Status = params.Status

	res, code, err := controller.violationTypeUsecase.Create(violationType)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res})
	return nil
}

func (controller *violationTypeController) Update(ctx *gin.Context) error {
	var params model.ViolationTypeBodyParams

	id, err := common.GetIDParam(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return nil
	}

	err = common.GetBodyParams(ctx, &params)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return err
	}

	violationType := new(model.ViolationType)
	violationType.Name = params.Name
	violationType.AmountFrom = params.AmountFrom
	violationType.AmountTo = params.AmountTo
	violationType.VehicleType = params.VehicleType
	violationType.Status = params.Status

	res, code, err := controller.violationTypeUsecase.Update(id, violationType)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res})
	return nil
}

func (controller *violationTypeController) Delete(ctx *gin.Context) error {
	id, err := common.GetIDParam(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return nil
	}

	code, err := controller.violationTypeUsecase.Delete(id)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
	}

	ctx.Status(http.StatusOK)
	return nil
}

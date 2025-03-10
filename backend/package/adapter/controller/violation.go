package controller

import (
	"net/http"
	"ts-backend/package/common"
	"ts-backend/package/types"
	"ts-backend/package/usecase/usecase"

	"ts-backend/package/domain/model"

	"github.com/gin-gonic/gin"
)

type violationController struct {
	violationUsecase usecase.Violation
}

type Violation interface {
	Report(c *gin.Context) error
	List(c *gin.Context) error
	GetOne(c *gin.Context) error
	Create(c *gin.Context) error
	Update(c *gin.Context) error
	Delete(c *gin.Context) error
}

func NewViolationController(uq usecase.Violation) Violation {
	return &violationController{uq}
}

func (controller *violationController) Report(ctx *gin.Context) error {
	res, code, err := controller.violationUsecase.Report()
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res})
	return nil
}

func (controller *violationController) List(ctx *gin.Context) error {
	query, err := common.GetQueries(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return err
	}

	res, count, code, err := controller.violationUsecase.List(query.Skip, query.Limit, query.Search, query.Sort, query.TimeStart, query.TimeEnd, query.Location)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res, Count: count, Limit: query.Limit, Skip: query.Skip})
	return nil
}

func (controller *violationController) GetOne(ctx *gin.Context) error {
	id, err := common.GetIDParam(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return nil
	}

	res, code, err := controller.violationUsecase.GetOne(id)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res})
	return nil
}

func (controller *violationController) Create(ctx *gin.Context) error {
	var params model.ViolationBodyParams

	err := common.GetBodyParams(ctx, &params)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return err
	}

	violation := new(model.Violation)
	violation.OfficerId = params.OfficerId
	violation.Plate = params.Plate
	violation.DriverName = params.DriverName
	violation.DriverDOB = params.DriverDOB
	violation.DriverNationality = params.DriverNationality
	violation.DriverAddress = params.DriverAddress
	violation.DriverJob = params.DriverJob
	violation.DriverId = params.DriverId
	violation.DriverIdDate = params.DriverIdDate
	violation.DriverIdAddress = params.DriverIdAddress
	violation.VehicleName = params.VehicleName
	violation.ViolationDate = params.ViolationDate
	violation.ViolationType = params.ViolationType
	violation.LocationStreet = params.LocationStreet
	violation.LocationDistrict = params.LocationDistrict
	violation.LocationCity = params.LocationCity
	violation.OfficerComment = params.OfficerComment
	violation.DriverComment = params.DriverComment
	violation.ItemsKepp = params.ItemsKepp
	violation.Penalty = params.Penalty
	violation.Status = params.Status

	res, code, err := controller.violationUsecase.Create(violation)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res})
	return nil
}

func (controller *violationController) Update(ctx *gin.Context) error {
	var params model.ViolationBodyParams

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

	violation := new(model.Violation)
	violation.OfficerId = params.OfficerId
	violation.Plate = params.Plate
	violation.DriverName = params.DriverName
	violation.DriverDOB = params.DriverDOB
	violation.DriverNationality = params.DriverNationality
	violation.DriverAddress = params.DriverAddress
	violation.DriverJob = params.DriverJob
	violation.DriverId = params.DriverId
	violation.DriverIdDate = params.DriverIdDate
	violation.DriverIdAddress = params.DriverIdAddress
	violation.VehicleName = params.VehicleName
	violation.ViolationDate = params.ViolationDate
	violation.ViolationType = params.ViolationType
	violation.LocationStreet = params.LocationStreet
	violation.LocationDistrict = params.LocationDistrict
	violation.LocationCity = params.LocationCity
	violation.OfficerComment = params.OfficerComment
	violation.DriverComment = params.DriverComment
	violation.ItemsKepp = params.ItemsKepp
	violation.Penalty = params.Penalty
	violation.Status = params.Status

	res, code, err := controller.violationUsecase.Update(id, violation)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res})
	return nil
}

func (controller *violationController) Delete(ctx *gin.Context) error {
	id, err := common.GetIDParam(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return nil
	}

	code, err := controller.violationUsecase.Delete(id)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
	}

	ctx.Status(http.StatusOK)
	return nil
}

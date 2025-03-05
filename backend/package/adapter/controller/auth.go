package controller

import (
	"fmt"
	"net/http"
	"ts-backend/package/common"
	"ts-backend/package/domain/model"
	"ts-backend/package/types"
	"ts-backend/package/usecase/usecase"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type authController struct {
	authUsecase usecase.Auth
	userUsecase usecase.User
}

type Auth interface {
	Login(c *gin.Context) error
	ChangePassword(c *gin.Context) error
	GetUser(id primitive.ObjectID) (*model.User, error)
}

func NewAuthController(ua usecase.Auth, uu usecase.User) Auth {
	return &authController{ua, uu}
}

func (controller *authController) Login(ctx *gin.Context) error {
	var user *model.User
	if err := ctx.Bind(&user); err != nil {
		ctx.JSON(http.StatusInternalServerError, types.Response{Error: err.Error()})
		return err
	}

	user, token, code, err := controller.authUsecase.Login(user)
	if err != nil {
		fmt.Println(code, err)
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.JSON(http.StatusAccepted, types.LoginResponse{Token: *token, User: types.LoginResponseUser{Id: user.Id, Username: user.Username, Name: user.Name, Role: user.Role}})
	return nil
}

func (controller *authController) ChangePassword(ctx *gin.Context) error {
	var params model.ChangePasswordParams

	err := common.GetBodyParams(ctx, &params)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return err
	}

	auth := common.GetAuth(ctx)

	code, err := controller.authUsecase.ChangePassword(auth.Username, params.OldPassword, params.NewPassword)
	if err != nil {
		fmt.Println(code, err)
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.JSON(code, types.Response{})
	return nil
}

func (controller *authController) GetUser(id primitive.ObjectID) (*model.User, error) {
	res, _, err := controller.userUsecase.GetOne(id)
	if err != nil {
		return nil, err
	}

	return res, nil
}

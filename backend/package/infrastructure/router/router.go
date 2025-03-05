package router

import (
	"ts-backend/package/adapter/controller"

	"github.com/gin-gonic/gin"
)

func NewRouter(e *gin.Engine, c controller.AppController) *gin.Engine {
	AuthRoute(e, c)
	UserRoute(e, c)
	ViolationRoute(e, c)
	ViolationTypeRoute(e, c)
	return e
}

package router

import (
	"ts-backend/package/adapter/controller"
	"ts-backend/package/infrastructure/middleware"

	"github.com/gin-gonic/gin"
)

func AuthRoute(router *gin.Engine, c controller.AppController) {
	auth := router.Group("/api/auth")
	auth.POST("login", func(context *gin.Context) {
		c.Auth.Login(context)
	})
	auth.Use(middleware.Authentication("user", c))
	{
		auth.POST("change-password", func(context *gin.Context) {
			c.Auth.ChangePassword(context)
		})
	}
}

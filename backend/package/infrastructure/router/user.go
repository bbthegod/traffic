package router

import (
	"ts-backend/package/adapter/controller"
	"ts-backend/package/infrastructure/middleware"

	"github.com/gin-gonic/gin"
)

func UserRoute(router *gin.Engine, c controller.AppController) {
	users := router.Group("/api/user")
	users.Use(middleware.Authentication("user", c))
	{
		users.GET("all", func(context *gin.Context) {
			c.User.All(context)
		})
		users.GET("", func(context *gin.Context) {
			c.User.List(context)
		})
		users.GET(":id", func(context *gin.Context) {
			c.User.GetOne(context)
		})
	}
	users.Use(middleware.Authentication("admin", c))
	{
		users.POST("", func(context *gin.Context) {
			c.User.Create(context)
		})
		users.PUT(":id", func(context *gin.Context) {
			c.User.Update(context)
		})
		users.DELETE(":id", func(context *gin.Context) {
			c.User.Delete(context)
		})
	}
}

package router

import (
	"ts-backend/package/adapter/controller"
	"ts-backend/package/infrastructure/middleware"

	"github.com/gin-gonic/gin"
)

func ViolationTypeRoute(router *gin.Engine, c controller.AppController) {
	users := router.Group("/api/violation-type")
	users.Use(middleware.Authentication("user", c))
	{
		users.GET("all", func(context *gin.Context) {
			c.ViolationType.All(context)
		})
		users.GET("", func(context *gin.Context) {
			c.ViolationType.List(context)
		})
		users.GET(":id", func(context *gin.Context) {
			c.ViolationType.GetOne(context)
		})
	}
	users.Use(middleware.Authentication("admin", c))
	{
		users.POST("", func(context *gin.Context) {
			c.ViolationType.Create(context)
		})
		users.PUT(":id", func(context *gin.Context) {
			c.ViolationType.Update(context)
		})
		users.DELETE(":id", func(context *gin.Context) {
			c.ViolationType.Delete(context)
		})
	}
}

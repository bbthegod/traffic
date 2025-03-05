package router

import (
	"ts-backend/package/adapter/controller"
	"ts-backend/package/infrastructure/middleware"

	"github.com/gin-gonic/gin"
)

func ViolationRoute(router *gin.Engine, c controller.AppController) {
	users := router.Group("/api/violation")
	users.Use(middleware.Authentication("user", c))
	{
		users.GET("report", func(context *gin.Context) {
			c.Violation.Report(context)
		})
		users.GET("", func(context *gin.Context) {
			c.Violation.List(context)
		})
		users.POST("", func(context *gin.Context) {
			c.Violation.Create(context)
		})
		users.GET(":id", func(context *gin.Context) {
			c.Violation.GetOne(context)
		})
		users.PUT(":id", func(context *gin.Context) {
			c.Violation.Update(context)
		})
		users.DELETE(":id", func(context *gin.Context) {
			c.Violation.Delete(context)
		})
	}
}

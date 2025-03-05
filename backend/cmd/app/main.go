package main

import (
	"log"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"

	"ts-backend/package/config"
	"ts-backend/package/infrastructure/datastore"
	"ts-backend/package/infrastructure/middleware"
	"ts-backend/package/infrastructure/router"
	"ts-backend/package/registry"
)

func main() {
	env := config.GetENV()

	db := datastore.NewDB()
	r := registry.NewRegistry(db)

	app := gin.Default()
	app.Use(middleware.CORS)
	app.Use(gzip.Gzip(gzip.DefaultCompression))
	app.Static("/public", "./public")
	router.NewRouter(app, r.NewAppController())

	log.Printf("\n\n PORT: %s \n ENV: %s \n\n", env.Port, env.Env)
	err := app.Run(":" + env.Port)
	if err != nil {
		log.Printf("Failed to start server!")
	}
}

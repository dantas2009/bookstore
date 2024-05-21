package main

import (
	"github.com/dantas2009/bookstore/order-service/config"
	"github.com/dantas2009/bookstore/order-service/router"
	"github.com/joho/godotenv"
)

var (
	logger *config.Logger
)

func main() {
	logger = config.GetLogger("main")

	errEnv := godotenv.Load(".env")
	if(errEnv != nil) {
		logger.Errorf("Error loading .env file")
	}
	
	err := config.Init()
	if err != nil {
		logger.Errorf("config initialization error: %v", err)
		return
	}

	router.Initialize()
}

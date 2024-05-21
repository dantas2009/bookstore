package router

import (
	"os"

	"github.com/dantas2009/bookstore/order-service/config"
	"github.com/dantas2009/bookstore/order-service/repositories"
	"github.com/dantas2009/bookstore/order-service/services"

	"github.com/gin-gonic/gin"
)

func Initialize() {
	router := gin.Default()

	favoriteRepository := repositories.NewFavoriteRepository(config.GetMongo())
	favoriteService := services.NewFavoriteService(favoriteRepository)
	cartItemRepository := repositories.NewCartItemRepository(config.GetMongo())
	cartItemService := services.NewCartItemService(cartItemRepository)
	orderItemRepository := repositories.NewOrderItemRepository(config.GetMongo())
	orderItemService := services.NewOrderItemService(orderItemRepository, cartItemService)
	orderRepository := repositories.NewOrderRepository(config.GetMongo())
	orderService := services.NewOrderService(orderRepository, orderItemService, cartItemService)

	initializeRoutes(
		router,
		favoriteService,
		cartItemService,
		orderService,
	)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8084"
	}

	router.Run(":" + port)
}

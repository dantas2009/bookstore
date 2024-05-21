package router

import (
	"github.com/dantas2009/bookstore/order-service/docs"
	"github.com/dantas2009/bookstore/order-service/handlers"
	"github.com/dantas2009/bookstore/order-service/services"

	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"github.com/gin-gonic/gin"
)

func initializeRoutes(
	router *gin.Engine,
	favoriteService *services.FavoriteService,
	cartItemService *services.CartItemService,
	orderService *services.OrderService,
) {

	basePath := "/api/v1"
	docs.SwaggerInfo.BasePath = basePath
	v1 := router.Group(basePath)

	favoritesGroup := v1.Group("/favorites")
	{
		favoritesGroup.POST("", func(ctx *gin.Context) {
			handlers.CreateFavorite(ctx, favoriteService)
		})

		favoritesGroup.GET("", func(ctx *gin.Context) {
			handlers.ListFavorites(ctx, favoriteService)
		})

		favoritesGroup.DELETE("/:id", func(ctx *gin.Context) {
			handlers.DeleteFavorite(ctx, favoriteService)
		})
	}

	cartItemsGroup := v1.Group("/carts")
	{
		cartItemsGroup.POST("", func(ctx *gin.Context) {
			handlers.CreateCartItem(ctx, cartItemService)
		})

		cartItemsGroup.PUT("/:id", func(ctx *gin.Context) {
			handlers.UpdateCartItem(ctx, cartItemService)
		})

		cartItemsGroup.GET("/:customer_uuid", func(ctx *gin.Context) {
			handlers.ListCartItems(ctx, cartItemService)
		})

		cartItemsGroup.DELETE("/:id", func(ctx *gin.Context) {
			handlers.DeleteCartItem(ctx, cartItemService)
		})
	}

	ordersGroup := v1.Group("/orders")
	{
		ordersGroup.POST("", func(ctx *gin.Context) {
			handlers.CreateOrder(ctx, orderService, cartItemService)
		})
		ordersGroup.GET("", func(ctx *gin.Context) {
			handlers.ListOrders(ctx, orderService)
		})
		ordersGroup.GET(":id", func(ctx *gin.Context) {
			handlers.FindOrder(ctx, orderService)
		})
	}

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
}

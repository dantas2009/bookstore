package handlers

import (
	"net/http"

	"github.com/dantas2009/bookstore/order-service/models"
	"github.com/dantas2009/bookstore/order-service/services"

	"github.com/gin-gonic/gin"
)

func CreateOrder(ctx *gin.Context, orderService *services.OrderService, cartItemService *services.CartItemService) {
    customerID, err := services.FetchCustomerIDByToken(ctx)
    if err != nil {
        msg := err.Error()
        sendError(ctx, http.StatusInternalServerError, &msg)
        return
    }

    if customerID == nil {
        sendError(ctx, http.StatusNotFound, nil)
        return
    }

    var or models.OrderRequest
    if err := ctx.BindJSON(&or); err != nil {
        msg := err.Error()
        sendError(ctx, http.StatusBadRequest, &msg)
        return
    }

    ot, err := cartItemService.OrderTotal(ctx, or.CustomerUUID, *customerID)
    if err != nil {
        msg := err.Error()
        sendError(ctx, http.StatusInternalServerError, &msg)
        return
    }

    o, err := models.OrderFromRequest(&or, *ot, *customerID)
    if err != nil {
        msg := err.Error()
        sendError(ctx, http.StatusInternalServerError, &msg)
        return
    }

    newO, err := orderService.CreateOrder(ctx, *o, or.CustomerUUID)
    if err != nil {
        msg := err.Error()
        sendError(ctx, http.StatusInternalServerError, &msg)
        return
    }

    sendSuccess(ctx, "create-cart", newO)
}

func ListOrders(ctx *gin.Context, orderService *services.OrderService) {
    carts, err := orderService.ListOrders(ctx)
    if err != nil {
        msg := err.Error()
        sendError(ctx, http.StatusInternalServerError, &msg)
        return
    }

    sendSuccess(ctx, "list-carts", carts)
}

func FindOrder(ctx *gin.Context, orderService *services.OrderService) {
    id := ctx.Param("id")
    cart, err := orderService.FindOrder(ctx, id)
    if err != nil {
        msg := err.Error()
        sendError(ctx, http.StatusInternalServerError, &msg)
        return
    }

    sendSuccess(ctx, "get-cart", cart)
}
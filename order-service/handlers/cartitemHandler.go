package handlers

import (
	"net/http"

	"github.com/dantas2009/bookstore/order-service/models"
	"github.com/dantas2009/bookstore/order-service/services"

	"github.com/gin-gonic/gin"
)

func CreateCartItem(ctx *gin.Context, cartItemService *services.CartItemService) {
    cir := models.CartItemRequest{}

    if err := ctx.BindJSON(&cir); err != nil {
        msg := err.Error()
        sendError(ctx, http.StatusBadRequest, &msg)
        return
    }

    b, err := services.FetchBookByID(cir.BookID)
    if err != nil {
        msg := err.Error()
        sendError(ctx, http.StatusInternalServerError, &msg)
        return
    }

    ci, err := models.CartItemFromRequest(cir, *b)
    if err != nil {
        msg := err.Error()
        sendError(ctx, http.StatusInternalServerError, &msg)
        return
    }

    if b.Inventory < ci.Quantity {
        msg := "book quantity is greater than stock"
        sendError(ctx, http.StatusBadRequest, &msg)
        return
    }

    newCi, err := cartItemService.CreateCartItem(ctx, ci, b)
    if err != nil {
        msg := err.Error()
        sendError(ctx, http.StatusInternalServerError, &msg)
        return
    }

    sendSuccess(ctx, "create-cartitem", newCi)
}

func UpdateCartItem(ctx *gin.Context, cartItemService *services.CartItemService) {
    cir := models.CartItemRequest{}

    if err := ctx.BindJSON(&cir); err != nil {
        msg := err.Error()
        sendError(ctx, http.StatusBadRequest, &msg)
        return
    }

    b, err := services.FetchBookByID(cir.BookID)
    if err != nil {
        msg := err.Error()
        sendError(ctx, http.StatusInternalServerError, &msg)
        return
    }

    ci, err := models.CartItemFromRequest(cir, *b)
    if err != nil {
        msg := err.Error()
        sendError(ctx, http.StatusInternalServerError, &msg)
        return
    }

    id := ctx.Param("id")
    if id == "" {
        msg := errParamIsRequired("id").Error()
        sendError(ctx, http.StatusBadRequest, &msg)
        return
    }
    ci.ID = id

    if b.Inventory < ci.Quantity {
        msg := "book quantity is greater than stock"
        sendError(ctx, http.StatusBadRequest, &msg)
        return
    }

    updatedCi, err := cartItemService.UpdateCartItem(ctx, *ci)
    if err != nil {
        msg := err.Error()
        sendError(ctx, http.StatusInternalServerError, &msg)
        return
    }

    sendSuccess(ctx, "update-cartitem", updatedCi)
}

func ListCartItems(ctx *gin.Context, cartItemService *services.CartItemService) {
    customerUUID := ctx.Param("customer_uuid")
    if customerUUID == "" {
        msg := errParamIsRequired("customer_uuid").Error()
        sendError(ctx, http.StatusBadRequest, &msg)
        return
    }

    cis, err := cartItemService.ListCartItemsByCustomerUUID(ctx, customerUUID)
    if err != nil {
        msg := err.Error()
        sendError(ctx, http.StatusInternalServerError, &msg)
        return
    }

    sendSuccess(ctx, "list-carts", cis)
}

func DeleteCartItem(ctx *gin.Context, cartItemService *services.CartItemService) {
    id := ctx.Param("id")
    if id == "" {
        msg := errParamIsRequired("id").Error()
        sendError(ctx, http.StatusBadRequest, &msg)
        return
    }

    err := cartItemService.DeleteCartItem(ctx, id)
    if err != nil {
        msg := err.Error()
        sendError(ctx, http.StatusInternalServerError, &msg)
        return
    }

    sendSuccess(ctx, "delete-cart", nil)
}

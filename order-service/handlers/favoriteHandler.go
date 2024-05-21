package handlers

import (
	"net/http"

	"github.com/dantas2009/bookstore/order-service/models"
	"github.com/dantas2009/bookstore/order-service/services"

	"github.com/gin-gonic/gin"
)

func CreateFavorite(ctx *gin.Context, favoriteService *services.FavoriteService) {
	customerID, err := services.FetchCustomerIDByToken(ctx)
	if err != nil {
		msg := err.Error()
		sendError(ctx, http.StatusInternalServerError, &msg)
		return
	}

	if customerID == nil{
		sendError(ctx, http.StatusNotFound, nil)
		return
	}

	fr := models.FavoriteRequest{}
	if err := ctx.BindJSON(&fr); err != nil {
		msg := err.Error()
		sendError(ctx, http.StatusBadRequest, &msg)
		return
	}

	f, err := models.FavoriteFromRequestAndCustomer(&fr, *customerID)
	if err != nil {
		msg := err.Error()
		sendError(ctx, http.StatusInternalServerError, &msg)
		return
	}

	newFav, err := favoriteService.CreateFavorite(ctx, *f)
	if err != nil {
		msg := err.Error()
		sendError(ctx, http.StatusInternalServerError, &msg)
		return
	}

	if newFav == nil {
		sendError(ctx, http.StatusNotFound, nil)
		return
	}

	sendSuccess(ctx, "create-favorite", newFav)
}

func ListFavorites(ctx *gin.Context, favoriteService *services.FavoriteService) {
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

	favs, err := favoriteService.ListFavorites(ctx, *customerID)
	if err != nil {
		msg := err.Error()
		sendError(ctx, http.StatusInternalServerError, &msg)
		return
	}

	sendSuccess(ctx, "list-favorites", favs)
}

func DeleteFavorite(ctx *gin.Context, favoriteService *services.FavoriteService) {
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

	id := ctx.Param("id")
	if id == "" {
		msg := errParamIsRequired("id").Error()
		sendError(ctx, http.StatusBadRequest, &msg)
		return
	}

	err = favoriteService.DeleteFavorite(ctx, id, *customerID)
	if err != nil {
		msg := err.Error()
		sendError(ctx, http.StatusInternalServerError, &msg)
		return
	}

	sendSuccess(ctx, "delete-favorite", nil)
}

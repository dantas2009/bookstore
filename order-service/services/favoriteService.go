package services

import (	
	"github.com/dantas2009/bookstore/order-service/models"
	"github.com/dantas2009/bookstore/order-service/repositories"

	"github.com/gin-gonic/gin"
)

type FavoriteService struct {
	repo *repositories.FavoriteRepository
}

func NewFavoriteService(repo *repositories.FavoriteRepository) *FavoriteService {
	return &FavoriteService{
		repo: repo,
	}
}

func (serv *FavoriteService) CreateFavorite(ctx *gin.Context, f models.Favorite) (*models.Favorite, error){
	newF, err := serv.repo.Insert(ctx, f)
	return newF, err
}

func (serv *FavoriteService) ListFavorites(ctx *gin.Context, customerID uint) ([]models.Favorite, error){
	fs, err := serv.repo.FindAllByCustomerID(ctx, customerID); 
	return fs, err
}

func (serv *FavoriteService) DeleteFavorite(ctx *gin.Context, id string, customerID uint) error{
	err := serv.repo.Delete(ctx, id, customerID)
	return err
}
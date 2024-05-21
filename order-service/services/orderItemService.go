package services

import (
	"github.com/dantas2009/bookstore/order-service/models"
	"github.com/dantas2009/bookstore/order-service/repositories"

	"github.com/gin-gonic/gin"
)

type OrderItemService struct {
	repo      *repositories.OrderItemRepository
	ciServ *CartItemService
}

func NewOrderItemService(repo *repositories.OrderItemRepository, ciServ *CartItemService) *OrderItemService {
	return &OrderItemService{
		repo:      repo,
		ciServ: ciServ,
	}
}

func (serv *OrderItemService) CreateOrderItems(ctx *gin.Context, orderID string, customerID uint,) ([]models.OrderItem, error) {
	ois := []models.OrderItem{}
	
	cis, err := serv.ciServ.ListCartItemsByCustomerID(ctx, customerID)
	if err != nil {
		return ois, err
	}

	for _, ci := range cis {
		oi := models.OrderItemFromCartItem(orderID, ci)
		ois = append(ois, oi)
	}

	_, err = serv.repo.InsertMany(ctx, ois)
	if err != nil {
		return ois, err
	}

	return ois, nil
}

func (serv *OrderItemService) ListOrderItemsByOrder(ctx *gin.Context, idOrder string) ([]models.OrderItem, error) {
	ois, err := serv.repo.FindAllByOrder(ctx, idOrder)
	if err != nil {
		return nil, err
	}

	return ois, nil
}

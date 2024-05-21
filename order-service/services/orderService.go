package services

import (
	"github.com/dantas2009/bookstore/order-service/models"
	"github.com/dantas2009/bookstore/order-service/repositories"

	"github.com/gin-gonic/gin"
)

type OrderService struct {
	repo   *repositories.OrderRepository
	oiServ *OrderItemService
	ciServ *CartItemService
}

func NewOrderService(repo *repositories.OrderRepository, oiServ *OrderItemService, ciServ *CartItemService) *OrderService {
	return &OrderService{
		repo:   repo,
		oiServ: oiServ,
		ciServ: ciServ,
	}
}

func (serv *OrderService) CreateOrder(ctx *gin.Context, o models.Order, customerUUID string) (*models.Order, error) {
	newO, err := serv.repo.Insert(ctx, o)
	if err != nil {
		return nil, err
	}

	ois, err := serv.oiServ.CreateOrderItems(ctx, newO.ID, o.CustomerID)
	if err != nil {
		return nil, err
	}
	newO.OrderItems = &ois

	if err := serv.ciServ.CartItemOrdered(ctx, o.CustomerID); err != nil {
		return nil, err
	}

	return newO, nil
}

func (serv *OrderService) ListOrders(ctx *gin.Context) ([]models.Order, error) {
	customerID, err := FetchCustomerIDByToken(ctx)
	if err != nil {
		return nil, err
	}

	os, err := serv.repo.FindAllByCustomer(ctx, *customerID)
	if err != nil {
		return nil, err
	}

	for i, o := range os {
		ois, err := serv.oiServ.ListOrderItemsByOrder(ctx, o.ID)
		if err != nil {
			return nil, err
		}
		os[i].OrderItems = &ois
	}

	return os, nil
}

func (serv *OrderService) FindOrder(ctx *gin.Context, orderID string) (*models.Order, error) {
	customerID, err := FetchCustomerIDByToken(ctx)
	if err != nil {
		return nil, err
	}

	o, err := serv.repo.FindById(ctx, orderID, *customerID)
	if err != nil {
		return nil, err
	}

	ois, err := serv.oiServ.ListOrderItemsByOrder(ctx, o.ID)
	if err != nil {
		return nil, err
	}
	o.OrderItems = &ois

	return o, nil
}

package services

import (
	"errors"

	"github.com/dantas2009/bookstore/order-service/models"
	"github.com/dantas2009/bookstore/order-service/repositories"

	"github.com/gin-gonic/gin"
)

type CartItemService struct {
	repo *repositories.CartItemRepository
}

func NewCartItemService(repo *repositories.CartItemRepository) *CartItemService {
	return &CartItemService{
		repo: repo,
	}
}

func (serv *CartItemService) CreateCartItem(ctx *gin.Context, ci *models.CartItem, b *models.Book) (*models.CartItem, error) {
	if oldCi, _ := serv.repo.FindCartItemByBookAndCustomer(ctx, ci.BookID, ci.CustomerUUID); oldCi != nil {
		oldCi.Quantity++

		if b.Inventory < oldCi.Quantity {
			return nil, errors.New("book quantity is greater than stock")
		}

		newCi, err := serv.repo.Update(ctx, *oldCi)
		return newCi, err
	}

	ci, err := serv.repo.Insert(ctx, *ci)

	return ci, err
}

func (serv *CartItemService) ListCartItemsByCustomerUUID(ctx *gin.Context, customerUUID string) ([]models.CartItem, error) {
	cis, err := serv.repo.FindAllByCustomerUUID(ctx, customerUUID)
	return cis, err
}

func (serv *CartItemService) ListCartItemsByCustomerID(ctx *gin.Context, customerID uint) ([]models.CartItem, error) {
	cis, err := serv.repo.FindAllByCustomerID(ctx, customerID)
	return cis, err
}

func (serv *CartItemService) FindCartItemByBookAndCustomer(ctx *gin.Context, bookID uint, customerUUID string) (*models.CartItem, error) {
	ci, err := serv.repo.FindCartItemByBookAndCustomer(ctx, bookID, customerUUID)
	return ci, err
}

func (serv *CartItemService) UpdateCartItem(ctx *gin.Context, ci models.CartItem) (*models.CartItem, error) {
	uf, err := serv.repo.Update(ctx, ci)
	return uf, err
}

func (s *CartItemService) DeleteCartItem(ctx *gin.Context, id string) error {
	err := s.repo.Delete(ctx, id)

	if err != nil {
		return err
	}
	return nil
}

func (s *CartItemService) OrderTotal(ctx *gin.Context, customerUUID string, customerID uint) (*models.OrderTotal, error) {
	cis, err := s.ListCartItemsByCustomerUUID(ctx, customerUUID)
	if err != nil {
		return nil, err
	}

	if len(cis) == 0 {
		return nil, errors.New("cart is empty")
	}

	for _, ci := range cis {
		ci.CustomerID = &customerID
		_, err := s.repo.Update(ctx, ci)
		if err != nil {
			return nil, err
		}

		b, err := FetchBookByID(ci.BookID)
		if err != nil {
			return nil, err
		}

		if b.Inventory < ci.Quantity {
			return nil, errors.New("book quantity is greater than stock")
		}
	}

	ot := models.OrderTotal{
		TotalAmount:   0,
		TotalDiscount: 0,
		TotalShipping: 0,
		TotalTax:      0,
	}

	for _, ci := range cis {
		ot.TotalAmount += ci.Price * float64(ci.Quantity)
		ot.TotalDiscount += ci.Discount * float64(ci.Quantity)
	}

	ot.TotalShipping += 9.99                                  //Request from shipping service
	ot.TotalTax += (ot.TotalAmount - ot.TotalDiscount) * 0.05 //5% tax - Request from tax service

	return &ot, nil
}

func (s *CartItemService) CartItemOrdered(ctx *gin.Context, customerID uint) error {
	cis, err := s.ListCartItemsByCustomerID(ctx, customerID)
	if err != nil {
		return err
	}

	for _, ci := range cis {
		ci.Ordered = true
		_, err := s.repo.Update(ctx, ci)
		if err != nil {
			return err
		}
	}

	return nil
}

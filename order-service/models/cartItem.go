package models

import (
	"go.mongodb.org/mongo-driver/bson"
	"gopkg.in/validator.v2"
)

type CartItem struct {
	ID           string  `bson:"_id,omitempty" json:"id"`
	CustomerID   *uint   `bson:"id_customer" json:"id_customer"`
	CustomerUUID string  `bson:"uuid_customer" json:"-"`
	BookID       uint    `bson:"id_book" json:"id_book"`
	Price        float64 `bson:"price" json:"price"`
	Discount     float64 `bson:"discount" json:"discount"`
	Quantity     int     `bson:"quantity" json:"quantity"`
	Ordered      bool    `bson:"ordered" json:"-"`
	CreatedAt    *string `bson:"created_at" json:"-"`
	DeletedAt    *string `bson:"deleted_at" json:"-"`
}

type CartItemRequest struct {
	BookID       uint   `json:"id_book" validate:"nonnil,nonzero"`
	CustomerID   *uint  `json:"id_customer"`
	CustomerUUID string `json:"uuid_customer" validate:"nonnil,nonzero"`
	Quantity     int    `json:"quantity" validate:"nonnil,nonzero"`
}

func CartItemFromRequest(cir CartItemRequest, b Book) (*CartItem, error) {
	err := validator.Validate(cir)

	if err != nil {
		return nil, err
	}

	return &CartItem{
		CustomerUUID: cir.CustomerUUID,
		Quantity:     cir.Quantity,
		BookID:       b.BookID,
		Price:        b.Price,
		Discount:     b.Discount,
		Ordered:      false,
	}, nil
}

func CartItemUpdate(ci CartItem) bson.M {

	return bson.M{"$set": bson.M{
		"id_customer": ci.CustomerID,
		"quantity":    ci.Quantity,
		"price":       ci.Price,
		"discount":    ci.Discount,
		"ordered":     ci.Ordered,
		"deleted_at":  ci.DeletedAt,
	}}

}

type CartItemResponseData struct {
	Message string   `json:"message"`
	Data    CartItem `json:"data"`
}

type ListCartItemsResponse struct {
	Message string     `json:"message"`
	Data    []CartItem `json:"data"`
}

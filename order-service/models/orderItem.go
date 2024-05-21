package models

import ()

type OrderItem struct {
	ID       string  `bson:"_id,omitempty" json:"-"`
	OrderID  string  `bson:"id_order" json:"-"`
	BookID   uint    `bson:"id_book" json:"id_book"`
	Price    float64 `bson:"price" json:"price"`
	Discount float64 `bson:"discount" json:"discount"`
	Quantity int     `bson:"quantity" json:"quantity"`
}

func OrderItemFromCartItem(orderID string, ci CartItem) (OrderItem) {
	return OrderItem{
		OrderID:  orderID,
		BookID:   ci.BookID,
		Price:    ci.Price,
		Quantity: ci.Quantity,
	}
}

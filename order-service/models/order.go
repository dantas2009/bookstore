package models

import (
	"gopkg.in/validator.v2"
)

type Order struct {
	ID                    string  `bson:"_id,omitempty" json:"id"`
	CustomerID            uint    `bson:"id_customer" json:"-"`
	CustomerAddressBillID uint    `bson:"id_customer_address_bill" json:"id_customer_address_bill"`
	CustomerAddressShipID uint    `bson:"id_customer_address_ship" json:"id_customer_address_ship"`
	PaymentMethod         string  `bson:"payment_method" json:"payment_method"`
	PaymentStatus         string  `bson:"payment_status" json:"payment_status"`
	TotalAmount           float64 `bson:"total_amount" json:"total_amount"`
	TotalDiscount         float64 `bson:"total_discount" json:"total_discount"`
	TotalShipping         float64 `bson:"total_shipping" json:"total_shipping"`
	TotalTax              float64 `bson:"total_tax" json:"total_tax"`
	ShippingStatus        string  `bson:"shipping_status" json:"shipping_status"`
	OrderAt               *string `bson:"order_at" json:"order_at"`
	OrderItems            *[]OrderItem `json:"order_items"`
}

type OrderTotal struct {
	TotalAmount   float64
	TotalDiscount float64
	TotalShipping float64
	TotalTax      float64
}

type OrderRequest struct {
	CustomerUUID          string `json:"uuid_customer" validate:"nonnil,nonzero"`
	CustomerAddressBillID uint   `json:"id_customer_address_bill" validate:"nonnil,nonzero"`
	CustomerAddressShipID uint   `json:"id_customer_address_ship" validate:"nonnil,nonzero"`
	PaymentMethod         string `json:"payment_method" validate:"nonnil,nonzero"`
}

func OrderFromRequest(or *OrderRequest, ot OrderTotal, customerID uint) (*Order, error) {
	if err := validator.Validate(or); err != nil {
		return nil, err
	}

	if err := validator.Validate(ot); err != nil {
		return nil, err
	}

	return &Order{
		CustomerID:            customerID,
		CustomerAddressBillID: or.CustomerAddressBillID,
		CustomerAddressShipID: or.CustomerAddressShipID,
		PaymentMethod:         or.PaymentMethod,
		PaymentStatus:         "pending",
		TotalAmount:           ot.TotalAmount,
		TotalDiscount:         ot.TotalDiscount,
		TotalShipping:         ot.TotalShipping,
		TotalTax:              ot.TotalTax,
		ShippingStatus:        "pending",
	}, nil
}

type OrderResponseData struct {
	Message string `json:"message"`
	Data    Order  `json:"data"`
}

type ListOrdersResponse struct {
	Message string  `json:"message"`
	Data    []Order `json:"data"`
}

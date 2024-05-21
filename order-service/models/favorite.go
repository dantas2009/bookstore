package models

import (
	"gopkg.in/validator.v2"
)

type Favorite struct {
	ID         string  `bson:"_id,omitempty" json:"-"`
	CustomerID uint    `bson:"id_customer" json:"-"`
	BookID     uint    `bson:"id_book" json:"id_book"`
	CreatedAt  *string `bson:"created_at" json:"-"`
	DeletedAt  *string `bson:"deleted_at" json:"-"`
}

type FavoriteRequest struct {
	BookID uint `json:"id_book" validate:"nonnil,nonzero"`
}

func FavoriteFromRequestAndCustomer(fr *FavoriteRequest, customerID uint) (*Favorite, error) {
	err := validator.Validate(fr)

	if err != nil {
		return nil, err
	}

	return &Favorite{
		CustomerID: customerID,
		BookID: fr.BookID,
	}, nil
}

type CreateFavoriteResponse struct {
	Message string   `json:"message"`
	Data    Favorite `json:"data"`
}

type ListFavoritesResponse struct {
	Message string     `json:"message"`
	Data    []Favorite `json:"data"`
}

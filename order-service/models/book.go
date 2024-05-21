package models

type Book struct {
	BookID      uint    `json:"id"`
	Price       float64 `json:"price"`
	Discount    float64 `json:"discount"`
	Inventory   int     `json:"inventory"`
}

type BookResponse struct {
	Data Book `json:"data"`
}

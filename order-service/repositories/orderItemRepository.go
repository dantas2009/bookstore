package repositories

import (
	"context"

	"github.com/dantas2009/bookstore/order-service/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type OrderItemRepository struct {
	db   *mongo.Database
	coll string
}

func NewOrderItemRepository(db *mongo.Database) *OrderItemRepository {
	return &OrderItemRepository{
		db:   db,
		coll: "order_items",
	}
}

func (repo *OrderItemRepository) InsertMany(ctx context.Context, ois []models.OrderItem) (*[]models.OrderItem, error) {
	var ioi []interface{}
	for _, oi := range ois {
		ioi = append(ioi, oi)
	}

	_, err := repo.db.Collection(repo.coll).InsertMany(ctx, ioi)
	if err != nil {
		return nil, err
	}

	return &ois, nil
}

func (s *OrderItemRepository) FindAllByOrder(ctx context.Context, idOrder string) ([]models.OrderItem, error) {

	filter := bson.M{"id_order": idOrder,}
	cursor, err := s.db.Collection(s.coll).Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var ois []models.OrderItem
	if err := cursor.All(ctx, &ois); err != nil {
		return nil, err
	}

	return ois, nil
}

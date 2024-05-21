package repositories

import (
	"context"
	"time"

	"github.com/dantas2009/bookstore/order-service/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type OrderRepository struct {
	db   *mongo.Database
	coll string
}

func NewOrderRepository(db *mongo.Database) *OrderRepository {
	return &OrderRepository{
		db:   db,
		coll: "orders",
	}
}

func (repo *OrderRepository) Insert(ctx context.Context, o models.Order) (*models.Order, error) {
	orderAt := time.Now().Local().Format(time.RFC3339)
	o.OrderAt = &orderAt

	res, err := repo.db.Collection(repo.coll).InsertOne(ctx, o)
	if err != nil {
		return nil, err
	}

	o.ID = res.InsertedID.(primitive.ObjectID).Hex()

	return &o, nil
}

func (repo *OrderRepository) Update(ctx context.Context, o models.Order) (*models.Order, error) {
	mID, err := primitive.ObjectIDFromHex(o.ID)
	if err != nil {
		return nil, err
	}

	filter := bson.M{"_id": mID}
	update := bson.M{"$set": bson.M{
		"payment_status":  o.PaymentStatus,
		"shipping_status": o.ShippingStatus,
	}}

	res, err := repo.db.Collection(repo.coll).UpdateOne(ctx, filter, update)

	if err != nil {
		return nil, err
	}

	if res.MatchedCount == 0 {
		return nil, mongo.ErrNoDocuments
	}

	return &o, nil
}

func (s *OrderRepository) FindAllByCustomer(c context.Context, customerID uint) ([]models.Order, error) {
	filter := bson.M{
		"id_customer": customerID,
	}
	cursor, err := s.db.Collection(s.coll).Find(c, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(c)

	var os []models.Order
	if err := cursor.All(c, &os); err != nil {
		return nil, err
	}

	return os, nil
}

func (service *OrderRepository) FindById(ctx context.Context, id string, customerID uint,) (*models.Order, error) {
	mID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	filter := bson.M{"_id": mID, "id_customer": customerID}

	res := service.db.Collection(service.coll).FindOne(ctx, filter)

	o := &models.Order{}
	if err := res.Decode(o); err != nil {
		return nil, err
	}

	return o, nil
}


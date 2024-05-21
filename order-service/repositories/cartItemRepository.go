package repositories

import (
	"context"
	"time"

	"github.com/dantas2009/bookstore/order-service/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CartItemRepository struct {
	db   *mongo.Database
	coll string
}

func NewCartItemRepository(db *mongo.Database) *CartItemRepository {
	return &CartItemRepository{
		db:   db,
		coll: "cart_items",
	}
}

func (repo *CartItemRepository) Insert(ctx context.Context, ci models.CartItem) (*models.CartItem, error) {
	now := time.Now().Local().Format(time.RFC3339)
	ci.CreatedAt = &now

	res, err := repo.db.Collection(repo.coll).InsertOne(ctx, ci)
	if err != nil {
		return nil, err
	}

	ci.ID = res.InsertedID.(primitive.ObjectID).Hex()

	return &ci, nil
}

func (repo *CartItemRepository) Update(ctx context.Context, ci models.CartItem) (*models.CartItem, error) {
	uId, err := primitive.ObjectIDFromHex(ci.ID)
	if err != nil {
		return nil, err
	}

	filter := bson.M{"_id": uId, "deleted_at": nil, "ordered": false}
	update := models.CartItemUpdate(ci)

	res, err := repo.db.Collection(repo.coll).UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, err
	}

	if res.MatchedCount == 0 {
		return nil, mongo.ErrNilDocument
	}

	return &ci, nil
}

func (serv *CartItemRepository) FindAllByFilter(ctx context.Context, filter bson.M) ([]models.CartItem, error) {
	var cis []models.CartItem

	cursor, err := serv.db.Collection(serv.coll).Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &cis); err != nil {
		return nil, err
	}

	return cis, nil
}

func (serv *CartItemRepository) FindAllByCustomerUUID(ctx context.Context, customerUUID string) ([]models.CartItem, error) {
	filter := bson.M{
		"uuid_customer": customerUUID,
		"ordered":       false,
		"deleted_at":    nil,
	}

	cis, err := serv.FindAllByFilter(ctx, filter)

	return cis, err
}

func (serv *CartItemRepository) FindAllByCustomerID(ctx context.Context, customerID uint) ([]models.CartItem, error) {
	filter := bson.M{
		"id_customer": customerID,
		"ordered":     false,
		"deleted_at":  nil,
	}

	cis, err := serv.FindAllByFilter(ctx, filter)

	return cis, err
}

func (serv *CartItemRepository) FindByFilter(ctx context.Context, filter bson.M) (*models.CartItem, error) {
	res := serv.db.Collection(serv.coll).FindOne(ctx, filter)

	ci := &models.CartItem{}
	if err := res.Decode(ci); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return ci, nil
}

func (serv *CartItemRepository) FindCartItemByBookAndCustomer(ctx context.Context, idBook uint, uuidCustomer string) (*models.CartItem, error) {
	filter := bson.M{
		"id_book":       idBook,
		"uuid_customer": uuidCustomer,
		"ordered":       false,
		"deleted_at":    nil,
	}

	ci, err := serv.FindByFilter(ctx, filter)

	return ci, err
}

func (serv *CartItemRepository) FindByID(ctx context.Context, id string) (*models.CartItem, error) {
	mID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	filter := bson.M{
		"_id":        mID,
		"ordered":    false,
		"deleted_at": nil,
	}

	ci, err := serv.FindByFilter(ctx, filter)

	return ci, err
}

func (repo *CartItemRepository) Delete(ctx context.Context, id string) error {
	ci, err := repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	if ci == nil {
		return nil
	}

	now := time.Now().Local().Format(time.RFC3339)
	ci.DeletedAt = &now

	_, err = repo.Update(ctx, *ci)
	if err != nil {
		return err
	}

	return nil
}

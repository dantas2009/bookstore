package repositories

import (
	"context"
	"time"

	"github.com/dantas2009/bookstore/order-service/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

)

type FavoriteRepository struct {
	db   *mongo.Database
	coll string
}

func NewFavoriteRepository(db *mongo.Database) *FavoriteRepository {
	return &FavoriteRepository{
		db:   db,
		coll: "favorites",
	}
}

func (serv *FavoriteRepository) Insert(ctx context.Context, f models.Favorite) (*models.Favorite, error) {
	now := time.Now().Local().Format(time.RFC3339)
	f.CreatedAt = &now

	res, err := serv.db.Collection(serv.coll).InsertOne(ctx, f)
	if err != nil {
		return nil, err
	}
	f.ID = res.InsertedID.(primitive.ObjectID).Hex()

	return &f, err
}

func (serv *FavoriteRepository) FindAllByFilter(ctx context.Context, filter bson.M) ([]models.Favorite, error) {
	var fs []models.Favorite

	cursor, err := serv.db.Collection(serv.coll).Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	defer cursor.Close(ctx)
	if err := cursor.All(ctx, &fs); err != nil {
		return nil, err
	}

	return fs, nil
}

func (serv *FavoriteRepository) FindAllByCustomerID(ctx context.Context, customerID uint) ([]models.Favorite, error) {
	filter := bson.M{"id_customer": customerID, "deleted_at": nil}
	
	fs, err := serv.FindAllByFilter(ctx, filter)

	return fs, err
}

func (serv *FavoriteRepository) Delete(ctx context.Context, id string, customerID uint) error {
	mID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	filter := bson.M{
		"_id": mID, 
		"customer_id": customerID, 
		"deleted_at": nil,
	}

	update := bson.M{
		"$set": bson.M{
			"deleted_at": time.Now().Local().Format(time.RFC3339),
		},
	}

	res, err := serv.db.Collection(serv.coll).UpdateOne(ctx, filter, update)

	if res.MatchedCount == 0 {
		return mongo.ErrNoDocuments
	}

	return err
}


package config

import (
	"os"
	"context"
	"errors"
	"fmt"
	

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func InitializeMongo() (*mongo.Client, error) {
    dbPath := os.Getenv("MONGO_DB")
    if dbPath == "" {
        return nil, errors.New("MONGO_DB environment variable is not set")
    }

    client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(dbPath))
    if err != nil {
        return nil, fmt.Errorf("error connecting to MongoDB: %w", err)
    }

    err = client.Ping(context.Background(), nil)
    if err != nil {
        return nil, fmt.Errorf("error pinging MongoDB server: %w", err)
    }

    return client, nil
}

package config

import (
	"fmt"

	"go.mongodb.org/mongo-driver/mongo"
)

var (
	client     *mongo.Client
	logger *Logger
)

func Init() error {
	var err error

	client, err = InitializeMongo()

	if err != nil {
		return fmt.Errorf("error initializing mongo: %v", err)
	}

	return nil
}

func GetMongo() *mongo.Database {
	return client.Database("bookstore")
}

func GetLogger(p string) *Logger {
	logger = NewLogger(p)
	return logger
}

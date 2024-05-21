package services

import (
	"os"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/dantas2009/bookstore/order-service/models"
)

func FetchCustomerIDByToken(ctx *gin.Context) (*uint, error) {
	header := ctx.GetHeader("Authorization")
	if header == "" {
		return nil, errors.New("authorization header missing")
	}

	url := os.Getenv("SERVICE_AUTH_URL")

	client := http.Client{
		Timeout: time.Second * 2,
	}

	r, err := http.NewRequest(http.MethodGet, url + "api/v1/user/customer", nil)
	if err != nil {
		return nil, err
	}

	r.Header.Set("Authorization", header)
	r.Header.Set("Accept", "application/json")

	res, err := client.Do(r)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	var auth models.AuthResponse
	if err := json.Unmarshal(body, &auth); err != nil {
		return nil, err
	}

	return auth.CustomerID, nil
}

func ErrCustomerNotFound() error{
	return errors.New("customer not found")
}
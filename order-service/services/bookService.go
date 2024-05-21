package services

import (
	"os"
	"encoding/json"
	"net/http"
	"time"
	"fmt"

	"github.com/dantas2009/bookstore/order-service/models"
)

func FetchBookByID(id uint) (*models.Book, error) {

	url := os.Getenv("SERVICE_BOOK_URL")

	client := http.Client{
		Timeout: time.Second * 2,
	}

	request, err := http.NewRequest(http.MethodGet, url + "api/v1/book/id/" + fmt.Sprint(id), nil)
	if err != nil {
		return nil, err
	}

	res, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HTTP error: %s", res.Status)
	}

	var br models.BookResponse
	if err := json.NewDecoder(res.Body).Decode(&br); err != nil {
		return nil, err
	}

	return &br.Data, nil
}

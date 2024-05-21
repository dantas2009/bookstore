FROM golang:1.22.3

WORKDIR /app

COPY go.* ./
RUN go mod download

COPY . .

RUN go build -o main .


EXPOSE 8084

CMD ["./main"]

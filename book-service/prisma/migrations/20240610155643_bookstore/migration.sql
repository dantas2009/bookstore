-- CreateTable
CREATE TABLE "books" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "published" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "effective_price" DOUBLE PRECISION NOT NULL,
    "language" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "sales_amount" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

CREATE OR REPLACE FUNCTION update_effective_price() RETURNS TRIGGER AS $$
BEGIN
    NEW."effective_price" := NEW."price" - NEW."discount";
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_effective_price
BEFORE INSERT OR UPDATE ON "books"
FOR EACH ROW EXECUTE PROCEDURE update_effective_price();

-- CreateTable
CREATE TABLE "genres" (
    "id" SERIAL NOT NULL,
    "genre" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventories" (
    "id" SERIAL NOT NULL,
    "id_book" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booksgenres" (
    "id" SERIAL NOT NULL,
    "id_book" INTEGER NOT NULL,
    "id_genre" INTEGER NOT NULL,

    CONSTRAINT "booksgenres_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_id_book_fkey" FOREIGN KEY ("id_book") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booksgenres" ADD CONSTRAINT "booksgenres_id_book_fkey" FOREIGN KEY ("id_book") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booksgenres" ADD CONSTRAINT "booksgenres_id_genre_fkey" FOREIGN KEY ("id_genre") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

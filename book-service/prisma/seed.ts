import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

    const genres = [];
    const genreNames = ['Fiction', 'Science', 'Mystery', 'Thriller', 'Romance', 'Horror', 'Fantasy', 'Biography', 'History', 'Art'];
    const inventories = [];
    const booksgenres = [];

    for(let i = 0; i < 10; i++) {
        genres.push({
            genre: genreNames[i],
        });
    }

    const books = Array.from({ length: 100 }, () => ({
        title: faker.lorem.words(3),
            author: faker.person.fullName(),
            publisher: faker.company.name(),
            published_at: faker.date.past(),
            description: faker.lorem.paragraph(),
            isbn: faker.string.uuid(),
            price: faker.number.float({ min: 50, max: 100, fractionDigits: 2 }),
            discount: faker.number.float({ min: 0, max: 49, fractionDigits: 2 }),
            language: faker.helpers.arrayElement(['English', 'Spanish', 'French', 'German']),
            image: faker.image.url(),
            sales_amount: faker.number.int(1000),
    }));

    await prisma.genres.createMany({
        data: genres
    });

    await prisma.books.createMany({
        data: books
    });

    for (let i = 1; i <= 100; i++) {
        inventories.push({
            id_book: i,
            quantity: Math.floor(Math.random() * 1000) + 1,
        });
    }

    await prisma.inventories.createMany({
        data: inventories
    });

    for (let i = 1; i <= 100; i++) {
        const genreId1 = Math.floor(Math.random() * 10) + 1;
        let genreId2 = Math.floor(Math.random() * 10) + 1;
        booksgenres.push({
            id_book: i,
            id_genre: genreId1,
        });
        if (Math.random() > 0.5) {
            while (genreId2 === genreId1) {
                genreId2 = Math.floor(Math.random() * 10) + 1;
            }
            booksgenres.push({
                id_book: i,
                id_genre: genreId2,
            });
        }
    }

    await prisma.booksgenres.createMany({
        data: booksgenres
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
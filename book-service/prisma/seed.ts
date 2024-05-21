import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

    const genres = [];
    const genreNames = [
        { id: 1, genre: 'Fiction', },
        { id: 2, genre: 'Dystopian', },
        { id: 3, genre: 'Science Fiction', },
        { id: 4, genre: 'Science', },
        { id: 5, genre: 'Physics', },
        { id: 6, genre: 'Astronomy', },
        { id: 7, genre: 'Biography', },
        { id: 8, genre: 'Memoir', },
        { id: 9, genre: 'Children', },
        { id: 10, genre: 'Mystery', }]
    const inventories = [];
    const books: any[] = []
    const bookList = [book1, book2, book3, book4, book5];
    const booksgenres = [];

    for (const genreName of genreNames) {
        genres.push({
            genre: genreName.genre,
        });
    }

    for (const book of bookList) {
        books.push({
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            published_at: book.published_at,
            description: book.description,
            isbn: book.isbn,
            price: book.price,
            discount: book.discount,
            language: book.language,
            image: book.image,
        });
    }

    await prisma.genres.createMany({
        data: genres
    });

    await prisma.books.createMany({
        data: books
    });

    for (let id = 1; id <= books.length; id++) {
        inventories.push({
            id_book: id,
            quantity: Math.floor(Math.random() * 1000) + 1,
        });
    }

    await prisma.inventories.createMany({
        data: inventories
    });

    for (let i = 0; i < books.length; i++) {
        for (const genre of bookList[i].genres) {
            const genreId = genreNames.find((g) => g.genre === genre)?.id ?? genreNames[0].id;
            booksgenres.push({
                id_book: i,
                id_genre: genreId,
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


const book1 = {
    id: 1,
    title: '1984',
    author: 'George Orwell',
    publisher: 'Signet Classic (January 1, 1961)',
    published_at: '1961-01-01',
    description: 'Written 75 years ago, 1984 was George Orwell’s chilling prophecy about the future. And while 1984 has come and gone, his dystopian vision of a government that will do anything to control the narrative is timelier than ever...',
    isbn: '9780451524935',
    price: 9.99,
    discount: 2.79,
    language: 'English',
    image: 'https://m.media-amazon.com/images/I/71rpa1-kyvL.AC_SX500.jpg',
    genres: ['Fiction', 'Dystopian', 'Science Fiction']
}

const book2 = {
    id: 2,
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    publisher: 'Random House Publishing Group',
    published_at: '1998-09-01',
    description: 'A landmark volume in science writing by one of the great minds of our time, Stephen Hawking’s book explores such profound questions as: How did the universe begin—and what made its start possible? Does time always flow forward? Is the universe unending—or are there boundaries? Are there other dimensions in space? What will happen when it all ends?\n\nTold in language we all can understand, A Brief History of Time plunges into the exotic realms of black holes and quarks, of antimatter and “arrows of time,” of the big bang and a bigger God—where the possibilities are wondrous and unexpected. With exciting images and profound imagination, Stephen Hawking brings us closer to the ultimate secrets at the very heart of creation.',
    isbn: '9780553380163',
    price: 18.00,
    discount: 8.1,
    language: 'English',
    image: 'https://m.media-amazon.com/images/I/51X2RycvYSL._SY445_SX342_.jpg',
    genres: ['Science', 'Physics', 'Astronomy']
}

const book3 = {
    id: 3,
    title: 'A Heartbreaking Work of Staggering Genius',
    author: 'Dave Eggers',
    publisher: 'Vintage',
    published_at: '2001-02-13',
    description: 'A Heartbreaking Work of Staggering Genius is the moving memoir of a college senior who, in the space of five weeks, loses both of his parents to cancer and inherits his eight-year-old brother. This exhilarating debut that manages to be simultaneously hilarious and wildly inventive as well as a deeply heartfelt story of the love that holds a family together.',
    isbn: '9780375725784',
    price: 19.00,
    discount: 7.98,
    language: 'English',
    image: 'https://m.media-amazon.com/images/I/41ja6Scd0qL._SY445_SX342_.jpg',
    genres: ['Biography', 'Memoir']
}

const book4 = {
    id: 4,
    title: 'Long Way Gone',
    author: 'Ishmael Beah',
    publisher: 'Sarah Crichton Books',
    published_at: '2008-08-05',
    description: 'In A Long Way Gone, Beah, now twenty-five years old, tells a riveting story: how at the age of twelve, he fled attacking rebels and wandered a land rendered unrecognizable by violence. By thirteen, he\'d been picked up by the government army, and Beah, at heart a gentle boy, found that he was capable of truly terrible acts. This is a rare and mesmerizing account, told with real literary force and heartbreaking honesty.',
    isbn: '9780374531263',
    price: 16.00,
    discount: 8.16,
    language: 'English',
    image: 'https://m.media-amazon.com/images/I/71ikTHqw2uL._SL1500_.jpg',
    genres: ['Biography', 'Memoir']
}

const book5 = {
    id: 5,
    title: 'The Bad Beginning: Or, Orphans!',
    author: 'Lemony Snicket',
    publisher: 'HarperCollins',
    published_at: '2007-05-08',
    description: 'Are you made fainthearted by death? Does fire unnerve you? Is a villain something that might crop up in future nightmares of yours? Are you thrilled by nefarious plots? Is cold porridge upsetting to you? Vicious threats? Hooks? Uncomfortable clothing?\n\nIt is likely that your answers will reveal A Series of Unfortunate Events to be ill-suited for your personal use. A librarian, bookseller, or acquaintance should be able to suggest books more appropriate for your fragile temperament. But to the rarest of readers we say, "Proceed, but cautiously."',
    isbn: '0061146307',
    price: 9.99,
    discount: 2.19,
    language: 'English',
    image: 'https://m.media-amazon.com/images/I/91My81zRcaL._SL1500_.jpg',
    genres: ['Fiction', 'Children', 'Mystery']
}
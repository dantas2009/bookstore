import { PrismaClient } from '@prisma/client';
import { OrderBy } from './OrderBy';

const prisma = new PrismaClient();

class BookRepository {
    async genres() {
        return await prisma.genres.findMany({
            where: {
                active: true,
            },
        });
    }

    async findById(id: number) {
        const book = await prisma.books.findUnique({
            where: {
                id: id,
                active: true,
            },
            include: {
                inventories: true,
                booksgenres: true,
            },
        });

        if (book === null) {
            return null;
        }

        return await this.processBook(book);
    }

    async getTotalCount() {
        return await prisma.books.count({
            where: { active: true },
        });
    }

    async search(page: number, pageSize: number, term: string, orderBy: OrderBy | undefined) {
        term = term.toLowerCase();
        const books = await prisma.books.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: {
                AND: [
                    { active: true },
                    {
                        OR: [
                            {
                                title: {
                                    contains: term,
                                    mode: 'insensitive',
                                },
                            },

                            {
                                author: {
                                    contains: term,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                publisher: {
                                    contains: term,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                description: {
                                    contains: term,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                isbn: {
                                    contains: term,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                language: {
                                    contains: term,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                booksgenres: {
                                    some: {
                                        genre: {
                                            genre: {
                                                contains: term,
                                                mode: 'insensitive',
                                            },
                                        },
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
            include: {
                inventories: true,
                booksgenres: true,
            },
            orderBy: this.getOrderBy(orderBy),
        });

        return await Promise.all(books.map(this.processBook));
    }

    async getTotalCountSearch(term: string) {
        term = term.toLowerCase();
        return await prisma.books.count({
            where: {
                AND: [
                    { active: true },
                    {
                        OR: [
                            {
                                title: {
                                    contains: term,
                                    mode: 'insensitive',
                                },
                            },

                            {
                                author: {
                                    contains: term,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                publisher: {
                                    contains: term,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                description: {
                                    contains: term,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                isbn: {
                                    contains: term,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                language: {
                                    contains: term,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                booksgenres: {
                                    some: {
                                        genre: {
                                            genre: {
                                                contains: term,
                                                mode: 'insensitive',
                                            },
                                        },
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
        });
    }

    async findByGenre(page: number, pageSize: number, genre: string, orderBy: OrderBy | undefined) {
        const books = await prisma.books.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: {
                AND: [
                    { active: true },
                    {
                        booksgenres: {
                            some: {
                                genre: {
                                    genre: {
                                        contains: genre,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            include: {
                inventories: true,
                booksgenres: true,
            },
            orderBy: this.getOrderBy(orderBy),
        });

        return await Promise.all(books.map(this.processBook));
    }

    async getTotalCountByGenre(genre: string) {
        return await prisma.books.count({
            where: {
                AND: [
                    { active: true },
                    {
                        booksgenres: {
                            some: {
                                genre: {
                                    genre: {
                                        contains: genre,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        },
                    },
                ],
            },
        });
    }

    async bestSellers(page: number, pageSize: number) {
        const books = await prisma.books.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: { active: true },
            include: {
                inventories: true,
                booksgenres: true,
            },
            orderBy: { sales_amount: 'desc' },
        });

        return await Promise.all(books.map(this.processBook));
    }

    async worstSellers(page: number, pageSize: number) {
        const books = await prisma.books.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: { active: true },
            include: {
                inventories: true,
                booksgenres: true,
            },
            orderBy: { sales_amount: 'asc' },
        });

        return await Promise.all(books.map(this.processBook));
    }

    async releases(page: number, pageSize: number) {
        const books =  await prisma.books.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: { active: true },
            include: {
                inventories: true,
                booksgenres: true,
            },
            orderBy: { published: 'desc' },
        });

        return await Promise.all(books.map(this.processBook));
    }

    private async processBook(book: any) {
        if (book === null) {
            return null;
        }
    
        let totalInventory = book.inventories.reduce((accumulator: number, inventory: { quantity: number }) => {
            return accumulator + inventory.quantity;
        }, 0);

        totalInventory = totalInventory - book.sales_amount;
    
        const { sales_amount, inventories, ...bookWithoutSalesAmount } = book;
        const bookWithInventory = {
            ...bookWithoutSalesAmount,
            inventory: totalInventory,
        };
    
        return bookWithInventory;
    }
    
    private getOrderBy(orderBy: OrderBy | undefined) {
        let response = {};
        if (!orderBy) {
            return
        };

        if (orderBy === OrderBy.PriceAsc) {
            response = { effective_price: 'asc' }
        } else if (orderBy === OrderBy.PriceDesc) {
            response = { effective_price: 'desc' }
        } else if (orderBy === OrderBy.TitleAsc) {
            response = { title: 'asc' }
        } else if (orderBy === OrderBy.TitleDesc) {
            response = { title: 'desc' }
        } else if (orderBy === OrderBy.Newest) {
            response = { created_at: 'desc' }
        } else if (orderBy === OrderBy.Discount) {
            response = { discount: 'desc' }
        }

        return response;
    }
}

export default BookRepository;

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
            },
        });

        if (book === null) {
            return null;
        }

        const totalInventory = book.inventories.reduce((accumulator, inventory) => accumulator + inventory.quantity, 0);

        if (book.sales_amount >= totalInventory) {
            return null;
        }

        return book;
    }

    async getTotalCount() {
        return await prisma.books.count();
    }

    async search(page: number, pageSize: number, term: string, orderBy: OrderBy | undefined) {
        term = term.toLowerCase();
        return await prisma.books.findMany({
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
            orderBy: this.getOrderBy(orderBy),
        });
    }

    async getTotalCountSearch(term: string) {
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
        return await prisma.books.findMany({
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
            orderBy: this.getOrderBy(orderBy),
        });
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

        return await prisma.books.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: { active: true },
            orderBy: { sales_amount: 'desc' },
        });
    }

    async releases(page: number, pageSize: number) {
        return await prisma.books.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: { active: true },
            orderBy: { published_at: 'desc' },
        });
    }

    private getOrderBy(orderBy: OrderBy | undefined) {
        let response = {};
        if (!orderBy) {
            return
        };

        if (orderBy === OrderBy.PriceAsc) {
            response = { price: 'asc' }
        } else if (orderBy === OrderBy.PriceDesc) {
            response = { price: 'desc' }
        } else if (orderBy === OrderBy.TitleAsc) {
            response = { title: 'asc' }
        } else if (orderBy === OrderBy.TitleDesc) {
            response = { title: 'desc' }
        } else if (orderBy === OrderBy.BestSellers) {
            response = { sales_amout: 'desc' }
        } else if (orderBy === OrderBy.PublisherDate) {
            response = { publisher_date: 'desc' }
        }

        return response;
    }
}

export default BookRepository;

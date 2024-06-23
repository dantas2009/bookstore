import BookRepository from './BookRepository';
import { OrderBy } from './OrderBy';
import cache from '../lib/cache';

class BookService {
    constructor(private bookRepository: BookRepository) { }

    async genres() {
        const chaceKey = 'genres:all';
        const cached = await cache.get(chaceKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const genres = await this.bookRepository.genres();
        const response = {
            data: genres,
        };

        if(genres.length === 0) {
            return null;
        }

        await cache.set(
            chaceKey,
            JSON.stringify(response),
            'EX',
            parseInt(process.env.CACHE_TIMEOUT ?? '3600')
        );
        return response;
    }

    async findById(id: number) {
        const book = await this.bookRepository.findById(id);

        if(!book) {
            return null;
        }

        const response = {
            data: book,
        };

        return response;
    }

    async search(page: number, pageSize: number, term: string, orderBy: OrderBy | undefined) {
        const books = await this.bookRepository.search(page, pageSize, term, orderBy);
        const totalCount = await this.bookRepository.getTotalCountSearch(term);
        const totalPages = Math.ceil(totalCount / pageSize);

        return {
            currentPage: page,
            pageSize: pageSize,
            totalCount: totalCount,
            totalPages: totalPages,
            pagination: {
                previousPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                pages: Array.from({ length: totalPages }, (_, i) => i + 1),
            },
            data: books,
        };
    }

    async findByGenre(genre: string, page: number, pageSize: number, orderBy: OrderBy | undefined) {
        const chaceKey = `genres:${genre}`;
        const cached = await cache.get(chaceKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const books = await this.bookRepository.findByGenre(page, pageSize, genre, orderBy);
        const totalCount = await this.bookRepository.getTotalCountByGenre(genre);
        const totalPages = Math.ceil(totalCount / pageSize);

        const response = {
            currentPage: page,
            pageSize: pageSize,
            totalCount: totalCount,
            totalPages: totalPages,
            pagination: {
                previousPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                pages: Array.from({ length: totalPages }, (_, i) => i + 1),
            },
            data: books,
        };

        if(books.length === 0) {
            return null;
        }

        await cache.set(
            chaceKey,
            JSON.stringify(response),
            'EX',
            parseInt(process.env.CACHE_TIMEOUT ?? '3600')
        );

        return response;
    }

    async bestSellers(page: number, pageSize: number) {
        const chaceKey = `bestsellers:${page}:${pageSize}`;
        const cached = await cache.get(chaceKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const books = await this.bookRepository.bestSellers(page, pageSize);
        const totalCount = await this.bookRepository.getTotalCount();
        const totalPages = Math.ceil(totalCount / pageSize);

        const response = {
            currentPage: page,
            pageSize: pageSize,
            totalCount: totalCount,
            totalPages: totalPages,
            pagination: {
                previousPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                pages: Array.from({ length: totalPages }, (_, i) => i + 1),
            },
            data: books,
        };

        if(books.length === 0) {
            return null;
        }

        await cache.set(
            chaceKey,
            JSON.stringify(response),
            'EX',
            parseInt(process.env.CACHE_TIMEOUT ?? '3600')
        );
        return response;
    }

    async worstSellers(page: number, pageSize: number) {
        const chaceKey = `worstsellers:${page}:${pageSize}`;
        const cached = await cache.get(chaceKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const books = await this.bookRepository.worstSellers(page, pageSize);
        const totalCount = await this.bookRepository.getTotalCount();
        const totalPages = Math.ceil(totalCount / pageSize);

        const response = {
            currentPage: page,
            pageSize: pageSize,
            totalCount: totalCount,
            totalPages: totalPages,
            pagination: {
                previousPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                pages: Array.from({ length: totalPages }, (_, i) => i + 1),
            },
            data: books,
        };

        if(books.length === 0) {
            return null;
        }

        await cache.set(
            chaceKey,
            JSON.stringify(response),
            'EX',
            parseInt(process.env.CACHE_TIMEOUT ?? '3600')
        );
        return response;
    }

    async releases(page: number, pageSize: number) {
        const chaceKey = `releases:${page}:${pageSize}`;
        const cached = await cache.get(chaceKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const books = await this.bookRepository.releases(page, pageSize);
        const totalCount = await this.bookRepository.getTotalCount();
        const totalPages = Math.ceil(totalCount / pageSize);

        const response = {
            currentPage: page,
            pageSize: pageSize,
            totalCount: totalCount,
            totalPages: totalPages,
            pagination: {
                previousPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                pages: Array.from({ length: totalPages }, (_, i) => i + 1),
            },
            data: books,
        };

        await cache.set(
            chaceKey,
            JSON.stringify(response),
            'EX',
            parseInt(process.env.CACHE_TIMEOUT ?? '3600')
        );
        return response;
    }
}

export default BookService;

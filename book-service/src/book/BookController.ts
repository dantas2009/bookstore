import { Request, Response } from 'express';
import { OrderBy } from './OrderBy';
import BookService from './BookService';
import BookRepository from './BookRepository';

const bookRepository = new BookRepository();
const bookService = new BookService(bookRepository);

class BookController {
    async genres(req: Request, res: Response) {
        try {
            const response = await bookService.genres();

            if (!response) {
                res.status(404).send();;
            }

            res.json(response);
        } catch (error) {
            res.status(500).send();
        }
    }

    async findById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const response = await bookService.findById(Number(id));

            if (!response) {
                res.status(404).send();;
            }

            res.json(response);
        } catch (error) {
            res.status(500).send();
        }
    }

    async search(req: Request, res: Response) {
        const { page, pageSize, term, orderBy } = req.query;
        try {
            const response = await bookService.search(
                Number(page),
                Number(pageSize),
                term as string,
                orderBy as OrderBy | undefined
            );

            if (!response) {
                res.status(404).send();
            }

            res.json(response);
        } catch (error) {
            res.status(500);
        }
    }

    async findByGenre(req: Request, res: Response) {
        const { genre, page, pageSize, orderBy } = req.query;
        try {
            const response = await bookService.findByGenre(
                genre as string,
                Number(page),
                Number(pageSize),
                orderBy as OrderBy | undefined
            );

            if (!response) {
                res.status(404).send();
            }

            res.json(response);
        } catch (error) {
            res.status(500).send();
        }
    }

    async bestSellers(req: Request, res: Response) {
        const { page, pageSize } = req.query;
        try {
            const response = await bookService.bestSellers(
                Number(page),
                Number(pageSize)
            );

            if (!response) {
                res.status(404).send();;
            }

            res.json(response);
        } catch (error) {
            res.status(500).send();
        }
    }

    async releases(req: Request, res: Response) {
        const { page, pageSize } = req.query;
        try {
            const response = await bookService.releases(
                Number(page),
                Number(pageSize)
            );

            if(!response) {
                res.status(404).send();
            }

            res.json(response);
        } catch (error) {
            res.status(500);
        }
    }
}

export default BookController;

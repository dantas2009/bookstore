import express from 'express';
import BookController from './BookController';

const bookController = new BookController();

export const routeBookV1 = express.Router();
routeBookV1.get('/genres', bookController.genres);
routeBookV1.get('/id/:id', bookController.findById);
routeBookV1.get('/search', bookController.search);
routeBookV1.get('/genre/:genre', bookController.findByGenre);
routeBookV1.get('/best-sellers', bookController.bestSellers);
routeBookV1.get('/worst-sellers', bookController.worstSellers);
routeBookV1.get('/releases', bookController.releases);

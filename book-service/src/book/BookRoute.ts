import express from 'express';
import BookController from './BookController';

const router = express.Router();

const bookController = new BookController();

router.get('/genres', bookController.genres);
router.get('/id/:id', bookController.findById);
router.get('/search', bookController.search);
router.get('/genre/:genre', bookController.findByGenre);
router.get('/best-sellers', bookController.bestSellers);
router.get('/releases', bookController.releases);

export default router;
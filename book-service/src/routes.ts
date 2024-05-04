import { Router } from 'express';
import BookRoute from './book/BookRoute';

const router = Router();

router.get('/', (req, res) => { res.send('Book Service') });
router.use('/book', BookRoute);

export default router;
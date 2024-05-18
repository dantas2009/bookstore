import { Router } from 'express';
import { routeBookV1 } from './book/BookRoute';

const router = Router();

router.get('/', (req, res) => { res.send('Book Service') });
router.use('/api/v1/book', routeBookV1);

export default router;
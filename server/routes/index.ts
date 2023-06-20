import Router from 'express';
import authMiddleware from '../middleware/authMiddleware';
import chatGptRouter from './chatGptRouter';
import utilRouter from './utilRouter';

const router = Router();

router.use('/chatgpt', authMiddleware, chatGptRouter);
router.use('/util', utilRouter);

export default router;

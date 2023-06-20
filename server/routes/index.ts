import Router from 'express';
import authMiddleware from '../middleware/authMiddleware';
import chatGptRouter from './chatGptRouter';

const router = Router();

router.use('/chatgpt', authMiddleware, chatGptRouter);

export default router;

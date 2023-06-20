import Router from 'express';
import ChatGptController from '../controllers/ChatGptController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post(
  '/',
  authMiddleware,
  (req, res) => ChatGptController.generatePage(req, res),
);

export default router;

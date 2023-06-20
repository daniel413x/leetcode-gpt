import Router from 'express';
import UtilController from '../controllers/UtilController';

const router = Router();

router.post(
  '/ping',
  (req, res) => UtilController.ping(req, res),
);

export default router;

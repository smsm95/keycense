import express from 'express';
import MerchandiseController from '../controllers/merchandise';
import { Role } from '../helpers/roles';
import { authorize, protect } from '../middleware/auth';

const router = express.Router();
const merchandiseController: MerchandiseController =
  new MerchandiseController();

router.get(
  '/',
  protect,
  authorize([Role.ADMIN, Role.USER]),
  merchandiseController.getAllMerchandise
);
router.get(
  '/:id',
  protect,
  authorize([Role.ADMIN, Role.USER]),
  merchandiseController.getMerchandiseById
);
router.post(
  '/',
  protect,
  authorize([Role.ADMIN, Role.USER]),
  merchandiseController.createMerchandise
);
router.put(
  '/:id',
  protect,
  authorize([Role.ADMIN, Role.USER]),
  merchandiseController.updateMerchandise
);
router.delete(
  '/:id',
  protect,
  authorize([Role.ADMIN, Role.USER]),
  merchandiseController.deleteMerchandise
);

export default router;

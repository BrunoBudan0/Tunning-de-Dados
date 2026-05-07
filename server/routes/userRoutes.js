import { Router }     from 'express';
import UserController from '../controllers/UserController.js';

const router = Router();

router.get('/',      UserController.getAll.bind(UserController));
router.get('/:id',   UserController.getById.bind(UserController));
router.post('/',     UserController.create.bind(UserController));
router.delete('/:id',UserController.remove.bind(UserController));

export default router;

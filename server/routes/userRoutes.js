import { Router }     from 'express';
import UserController from '../controllers/UserController.js';

const router = Router();

router.get('/',                    UserController.getAll.bind(UserController));
router.get('/email/:email',        UserController.findByEmail.bind(UserController));
router.get('/:id',                 UserController.getById.bind(UserController));
router.post('/',                   UserController.create.bind(UserController));
router.post('/login',              UserController.login.bind(UserController));
router.patch('/:id/senha',         UserController.updatePassword.bind(UserController));
router.delete('/:id',              UserController.remove.bind(UserController));

export default router;

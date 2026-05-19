import { Router }     from 'express';
import AulaController from '../controllers/AulaController.js';

const router = Router();

router.get('/curso/:IDCurso', AulaController.getByCurso.bind(AulaController));
router.get('/:id',            AulaController.getById.bind(AulaController));
router.post('/',              AulaController.create.bind(AulaController));
router.delete('/:id',         AulaController.remove.bind(AulaController));

export default router;

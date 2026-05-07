import { Router }           from 'express';
import ProgressoController  from '../controllers/ProgressoController.js';

const router = Router();

router.get('/:id_usuario/:id_curso', ProgressoController.buscar.bind(ProgressoController));
router.post('/',                     ProgressoController.salvar.bind(ProgressoController));
router.post('/matricular',           ProgressoController.matricular.bind(ProgressoController));
router.patch('/aula',                ProgressoController.concluirAula.bind(ProgressoController));

export default router;

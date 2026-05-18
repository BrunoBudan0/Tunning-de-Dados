import { Router }           from 'express';
import ProgressoController  from '../controllers/ProgressoController.js';

const router = Router();

router.get('/matriculas/:id_usuario', ProgressoController.buscarMatriculas.bind(ProgressoController));
router.get('/aulas/:id_usuario',      ProgressoController.buscarAulasUsuario.bind(ProgressoController));
router.get('/:id_usuario/:id_curso',  ProgressoController.buscar.bind(ProgressoController));
router.get('/:id_usuario',            ProgressoController.buscarTodos.bind(ProgressoController));
router.post('/matricular',           ProgressoController.matricular.bind(ProgressoController));
router.post('/',                     ProgressoController.salvar.bind(ProgressoController));
router.patch('/aula',                ProgressoController.concluirAula.bind(ProgressoController));

export default router;

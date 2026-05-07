import { Router }       from 'express';
import CourseController from '../controllers/CourseController.js';

const router = Router();

router.get('/',      CourseController.getAll.bind(CourseController));
router.get('/:id',   CourseController.getById.bind(CourseController));
router.post('/',     CourseController.create.bind(CourseController));
router.delete('/:id',CourseController.remove.bind(CourseController));

export default router;

import CourseDAO from '../dao/CourseDAO.js';
import Course    from '../models/Course.js';

class CourseController {

  // GET /api/courses
  async getAll(req, res) {
    try {
      const courses = await CourseDAO.findAll();
      res.json(courses);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // GET /api/courses/:id
  async getById(req, res) {
    try {
      const course = await CourseDAO.findById(req.params.id);
      if (!course) return res.status(404).json({ error: 'Curso não encontrado' });
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // POST /api/courses
  async create(req, res) {
    try {
      const course = new Course(req.body);
      const saved  = await CourseDAO.save(course);
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // DELETE /api/courses/:id
  async remove(req, res) {
    try {
      await CourseDAO.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default new CourseController();

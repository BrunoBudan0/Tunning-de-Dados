import AulaDAO from '../dao/AulaDAO.js';
import Aula    from '../models/Aula.js';

class AulaController {

  // GET /api/aulas/curso/:IDCurso
  async getByCurso(req, res) {
    try {
      const aulas = await AulaDAO.findByCurso(req.params.IDCurso);
      res.json(aulas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // GET /api/aulas/:id
  async getById(req, res) {
    try {
      const aula = await AulaDAO.findById(req.params.id);
      if (!aula) return res.status(404).json({ error: 'Aula não encontrada' });
      res.json(aula);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // POST /api/aulas
  async create(req, res) {
    try {
      const aula  = new Aula(req.body);
      const saved = await AulaDAO.save(aula);
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // DELETE /api/aulas/:id
  async remove(req, res) {
    try {
      await AulaDAO.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default new AulaController();

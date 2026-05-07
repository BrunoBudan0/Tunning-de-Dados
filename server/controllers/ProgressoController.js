import ProgressoDAO      from '../dao/ProgressoDAO.js';
import CursosUsuarioDAO  from '../dao/CursosUsuarioDAO.js';
import AulaUsuarioDAO    from '../dao/AulaUsuarioDAO.js';

class ProgressoController {

  // GET /api/progresso/:id_usuario/:id_curso
  async buscar(req, res) {
    try {
      const { id_usuario, id_curso } = req.params;
      const progresso = await ProgressoDAO.buscar(id_usuario, id_curso);
      res.json(progresso);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // POST /api/progresso
  async salvar(req, res) {
    try {
      const { id_usuario, id_curso, progresso } = req.body;
      await ProgressoDAO.salvar(id_usuario, id_curso, progresso);
      res.status(201).json({ message: 'Progresso salvo' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // POST /api/progresso/matricular
  async matricular(req, res) {
    try {
      const { id_usuario, id_curso } = req.body;
      await CursosUsuarioDAO.matricular(id_usuario, id_curso);
      res.status(201).json({ message: 'Matricula realizada' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // PATCH /api/progresso/aula
  async concluirAula(req, res) {
    try {
      const { id_usuario, id_aula } = req.body;
      await AulaUsuarioDAO.concluirAula(id_usuario, id_aula);
      res.json({ message: 'Aula concluída' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export default new ProgressoController();

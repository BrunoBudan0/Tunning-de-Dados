import ProgressoDAO      from '../dao/ProgressoDAO.js';
import CursosUsuarioDAO  from '../dao/CursosUsuarioDAO.js';
import AulaUsuarioDAO    from '../dao/AulaUsuarioDAO.js';
import CursoUsuario      from '../models/CursoUsuario.js';

// Cassandra está modelado com colunas text — garanta strings em todos os IDs
const s = (v) => v === null || v === undefined ? v : String(v);

class ProgressoController {

  // GET /api/progresso/:id_usuario/:id_curso
  async buscar(req, res) {
    try {
      const id_usuario = s(req.params.id_usuario);
      const id_curso   = s(req.params.id_curso);
      const progresso = await ProgressoDAO.buscar(id_usuario, id_curso);

      if (!progresso) {
        return res.status(404).json({ error: 'Progresso não encontrado' });
      }

      res.json(progresso);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // GET /api/progresso/:id_usuario
  async buscarTodos(req, res) {
    try {
      const id_usuario = s(req.params.id_usuario);
      const lista = await ProgressoDAO.buscarTodosPorUsuario(id_usuario);
      res.json(lista);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // GET /api/progresso/matriculas/:id_usuario
  async buscarMatriculas(req, res) {
    try {
      const id_usuario = s(req.params.id_usuario);
      const lista = await CursosUsuarioDAO.buscarPorUsuario(id_usuario);
      res.json(lista);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // GET /api/progresso/aulas/:id_usuario
  async buscarAulasUsuario(req, res) {
    try {
      const id_usuario = s(req.params.id_usuario);
      const lista = await AulaUsuarioDAO.buscarPorUsuario(id_usuario);
      res.json(lista);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // POST /api/progresso
  async salvar(req, res) {
    try {
      const id_usuario = s(req.body.id_usuario);
      const id_curso   = s(req.body.id_curso);
      const { progresso } = req.body;
      const salvo = await ProgressoDAO.salvar(id_usuario, id_curso, progresso);
      res.status(201).json(salvo);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // POST /api/progresso/matricular
  async matricular(req, res) {
    try {
      const id_usuario = s(req.body.id_usuario);
      const id_curso   = s(req.body.id_curso);
      const ids_aulas  = (req.body.ids_aulas || []).map(s);

      const matricula = await CursosUsuarioDAO.matricular(id_usuario, id_curso);
      await ProgressoDAO.salvar(id_usuario, id_curso, 0);

      await Promise.all(
        ids_aulas.map(id_aula => AulaUsuarioDAO.registrar(id_usuario, id_aula))
      );

      res.status(201).json({ message: 'Matrícula realizada', matricula });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // PATCH /api/progresso/aula
  async concluirAula(req, res) {
    try {
      const id_usuario     = s(req.body.id_usuario);
      const id_aula        = s(req.body.id_aula);
      const id_curso       = s(req.body.id_curso);
      const { progresso_atual } = req.body;

      await AulaUsuarioDAO.concluirAula(id_usuario, id_aula);

      if (id_curso !== undefined && progresso_atual !== undefined) {
        const salvo = await ProgressoDAO.salvar(id_usuario, id_curso, progresso_atual);

        if (salvo.estaConcluido()) {
          await CursosUsuarioDAO.atualizarStatus(
            id_usuario,
            id_curso,
            CursoUsuario.STATUS.CONCLUIDO
          );
        }
      }

      res.json({ message: 'Aula concluída' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export default new ProgressoController();

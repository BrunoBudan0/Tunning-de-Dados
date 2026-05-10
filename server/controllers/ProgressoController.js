import ProgressoDAO      from '../dao/ProgressoDAO.js';
import CursosUsuarioDAO  from '../dao/CursosUsuarioDAO.js';
import AulaUsuarioDAO    from '../dao/AulaUsuarioDAO.js';
import CursoUsuario      from '../models/CursoUsuario.js';

class ProgressoController {

  // GET /api/progresso/:id_usuario/:id_curso
  async buscar(req, res) {
    try {
      const { id_usuario, id_curso } = req.params;
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
      const { id_usuario } = req.params;
      const lista = await ProgressoDAO.buscarTodosPorUsuario(id_usuario);
      res.json(lista);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // POST /api/progresso
  async salvar(req, res) {
    try {
      const { id_usuario, id_curso, progresso } = req.body;
      const salvo = await ProgressoDAO.salvar(id_usuario, id_curso, progresso);
      res.status(201).json(salvo);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // POST /api/progresso/matricular
  // Matricula o usuário E já registra as aulas como 'nao_iniciada'
  async matricular(req, res) {
    try {
      const { id_usuario, id_curso, ids_aulas = [] } = req.body;

      // 1. Cria a matrícula no curso
      const matricula = await CursosUsuarioDAO.matricular(id_usuario, id_curso);

      // 2. Inicializa o progresso zerado
      await ProgressoDAO.salvar(id_usuario, id_curso, 0);

      // 3. Registra cada aula como 'nao_iniciada' (se os IDs foram enviados)
      await Promise.all(
        ids_aulas.map(id_aula => AulaUsuarioDAO.registrar(id_usuario, id_aula))
      );

      res.status(201).json({ message: 'Matrícula realizada', matricula });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // PATCH /api/progresso/aula
  // Conclui uma aula e atualiza o status da matrícula se necessário
  async concluirAula(req, res) {
    try {
      const { id_usuario, id_aula, id_curso, progresso_atual } = req.body;

      // 1. Marca a aula como concluída
      await AulaUsuarioDAO.concluirAula(id_usuario, id_aula);

      // 2. Atualiza o progresso percentual do curso
      if (id_curso !== undefined && progresso_atual !== undefined) {
        const salvo = await ProgressoDAO.salvar(id_usuario, id_curso, progresso_atual);

        // 3. Se chegou a 100%, marca a matrícula como concluída automaticamente
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
// Matrículas de usuários em cursos
// Banco: Cassandra — tabela cursos_usuario

import client      from '../config/cassandra.js';
import CursoUsuario from '../models/CursoUsuario.js';

class CursosUsuarioDAO {

  // Insere uma nova matrícula — upsert automático pelo Cassandra
  async matricular(id_usuario, id_curso) {
    const cursoUsuario = new CursoUsuario({ id_usuario, id_curso });

    const query = `
      INSERT INTO cursos_usuario (id_usuario, id_curso, status)
      VALUES (?, ?, ?)
    `;
    await client.execute(
      query,
      [cursoUsuario.id_usuario, cursoUsuario.id_curso, cursoUsuario.status],
      { prepare: true }
    );

    return cursoUsuario;
  }

  // Lista todos os cursos de um usuário (partition key → rápido)
  async buscarPorUsuario(id_usuario) {
    const query = `SELECT * FROM cursos_usuario WHERE id_usuario = ?`;
    const result = await client.execute(query, [id_usuario], { prepare: true });
    return result.rows.map(row => new CursoUsuario(row));
  }

  // Busca a matrícula específica de um usuário em um curso
  async buscarUm(id_usuario, id_curso) {
    const query = `
      SELECT * FROM cursos_usuario
      WHERE id_usuario = ? AND id_curso = ?
    `;
    const result = await client.execute(query, [id_usuario, id_curso], { prepare: true });
    const row = result.rows[0];
    return row ? new CursoUsuario(row) : null;
  }

  // Atualiza o status da matrícula (ex: 'em_andamento', 'concluido')
  async atualizarStatus(id_usuario, id_curso, status) {
    if (!CursoUsuario.statusValido(status)) {
      throw new Error(`Status inválido: ${status}`);
    }

    const query = `
      UPDATE cursos_usuario SET status = ?
      WHERE id_usuario = ? AND id_curso = ?
    `;
    await client.execute(query, [status, id_usuario, id_curso], { prepare: true });
  }
}

export default new CursosUsuarioDAO();
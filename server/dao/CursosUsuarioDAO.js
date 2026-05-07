// Matrículas de usuários em cursos
// Banco: Cassandra — tabela cursos_usuario

import client from '../config/cassandra.js';

class CursosUsuarioDAO {

  async matricular(id_usuario, id_curso) {
    const query = `
      INSERT INTO cursos_usuario (id_usuario, id_curso, status)
      VALUES (?, ?, 'matriculado')
    `;
    await client.execute(query, [id_usuario, id_curso], { prepare: true });
  }

  async buscarPorUsuario(id_usuario) {
    const query = `SELECT * FROM cursos_usuario WHERE id_usuario = ?`;
    const result = await client.execute(query, [id_usuario], { prepare: true });
    return result.rows;
  }

  async atualizarStatus(id_usuario, id_curso, status) {
    const query = `
      UPDATE cursos_usuario SET status = ?
      WHERE id_usuario = ? AND id_curso = ?
    `;
    await client.execute(query, [status, id_usuario, id_curso], { prepare: true });
  }
}

export default new CursosUsuarioDAO();

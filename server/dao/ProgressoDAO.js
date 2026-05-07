// Progresso geral do usuário em um curso
// Banco: Cassandra — tabela progresso

import client from '../config/cassandra.js';

class ProgressoDAO {

  async salvar(id_usuario, id_curso, progresso) {
    const query = `
      INSERT INTO progresso (id_usuario, id_curso, progresso)
      VALUES (?, ?, ?)
    `;
    await client.execute(query, [id_usuario, id_curso, progresso], { prepare: true });
  }

  async buscar(id_usuario, id_curso) {
    const query = `
      SELECT * FROM progresso
      WHERE id_usuario = ? AND id_curso = ?
    `;
    const result = await client.execute(query, [id_usuario, id_curso], { prepare: true });
    return result.rows[0] ?? null;
  }

  async buscarTodosPorUsuario(id_usuario) {
    const query = `SELECT * FROM progresso WHERE id_usuario = ?`;
    const result = await client.execute(query, [id_usuario], { prepare: true });
    return result.rows;
  }
}

export default new ProgressoDAO();

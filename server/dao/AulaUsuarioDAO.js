// Status de cada aula por usuário
// Banco: Cassandra — tabela aula_usuario

import client from '../config/cassandra.js';

class AulaUsuarioDAO {

  async registrar(id_usuario, id_aula) {
    const query = `
      INSERT INTO aula_usuario (id_usuario, id_aula, status)
      VALUES (?, ?, 'nao_iniciada')
    `;
    await client.execute(query, [id_usuario, id_aula], { prepare: true });
  }

  async buscarPorUsuario(id_usuario) {
    const query = `SELECT * FROM aula_usuario WHERE id_usuario = ?`;
    const result = await client.execute(query, [id_usuario], { prepare: true });
    return result.rows;
  }

  async concluirAula(id_usuario, id_aula) {
    const query = `
      UPDATE aula_usuario SET status = 'concluida'
      WHERE id_usuario = ? AND id_aula = ?
    `;
    await client.execute(query, [id_usuario, id_aula], { prepare: true });
  }
}

export default new AulaUsuarioDAO();

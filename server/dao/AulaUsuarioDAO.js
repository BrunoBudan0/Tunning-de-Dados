// Status de cada aula por usuário
// Banco: Cassandra — tabela aula_usuario

import client     from '../config/cassandra.js';
import AulaUsuario from '../models/AulaUsuario.js';

class AulaUsuarioDAO {

  // Registra uma aula como 'nao_iniciada' para o usuário
  async registrar(id_usuario, id_aula) {
    const aulaUsuario = new AulaUsuario({ id_usuario, id_aula });

    const query = `
      INSERT INTO aula_usuario (id_usuario, id_aula, status)
      VALUES (?, ?, ?)
    `;
    await client.execute(
      query,
      [aulaUsuario.id_usuario, aulaUsuario.id_aula, aulaUsuario.status],
      { prepare: true }
    );

    return aulaUsuario;
  }

  // Lista todas as aulas de um usuário
  async buscarPorUsuario(id_usuario) {
    const query = `SELECT * FROM aula_usuario WHERE id_usuario = ?`;
    const result = await client.execute(query, [id_usuario], { prepare: true });
    return result.rows.map(row => new AulaUsuario(row));
  }

  // Busca o status de uma aula específica para um usuário
  async buscarUma(id_usuario, id_aula) {
    const query = `
      SELECT * FROM aula_usuario
      WHERE id_usuario = ? AND id_aula = ?
    `;
    const result = await client.execute(query, [id_usuario, id_aula], { prepare: true });
    const row = result.rows[0];
    return row ? new AulaUsuario(row) : null;
  }

  // Marca a aula como concluída
  async concluirAula(id_usuario, id_aula) {
    const query = `
      UPDATE aula_usuario SET status = ?
      WHERE id_usuario = ? AND id_aula = ?
    `;
    await client.execute(
      query,
      [AulaUsuario.STATUS.CONCLUIDA, id_usuario, id_aula],
      { prepare: true }
    );
  }
}

export default new AulaUsuarioDAO();
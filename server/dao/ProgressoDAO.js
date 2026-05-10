// Progresso geral do usuário em um curso (0–100%)
// Banco: Cassandra — tabela progresso

import client   from '../config/cassandra.js';
import Progresso from '../models/Progresso.js';

class ProgressoDAO {

  // Salva ou atualiza o progresso — upsert automático pelo Cassandra
  async salvar(id_usuario, id_curso, valor) {
    const progresso = new Progresso({
      id_usuario,
      id_curso,
      // IMPORTANTE: normaliza antes de gravar para nunca sair de [0, 100]
      progresso: Progresso.normalizar(valor),
    });

    const query = `
      INSERT INTO progresso (id_usuario, id_curso, progresso)
      VALUES (?, ?, ?)
    `;
    await client.execute(
      query,
      [progresso.id_usuario, progresso.id_curso, progresso.progresso],
      { prepare: true }
    );

    return progresso;
  }

  // Busca o progresso de um usuário em um curso específico
  async buscar(id_usuario, id_curso) {
    const query = `
      SELECT * FROM progresso
      WHERE id_usuario = ? AND id_curso = ?
    `;
    const result = await client.execute(query, [id_usuario, id_curso], { prepare: true });
    const row = result.rows[0];
    return row ? new Progresso(row) : null;
  }

  // Lista o progresso de um usuário em todos os cursos
  async buscarTodosPorUsuario(id_usuario) {
    const query = `SELECT * FROM progresso WHERE id_usuario = ?`;
    const result = await client.execute(query, [id_usuario], { prepare: true });
    return result.rows.map(row => new Progresso(row));
  }
}

export default new ProgressoDAO();
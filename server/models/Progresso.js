// Representa o progresso percentual de um usuário em um curso
// Armazenado no Cassandra — tabela progresso

class Progresso {
  static PROGRESSO_MIN = 0;
  static PROGRESSO_MAX = 100;

  constructor({ id_usuario, id_curso, progresso = 0 }) {
    this.id_usuario = id_usuario;
    this.id_curso   = id_curso;
    this.progresso  = progresso;
  }

  // Garante que o valor nunca sai do intervalo [0, 100]
  static normalizar(valor) {
    return Math.min(Progresso.PROGRESSO_MAX, Math.max(Progresso.PROGRESSO_MIN, valor));
  }

  estaConcluido() {
    return this.progresso >= Progresso.PROGRESSO_MAX;
  }

  toRow() {
    return { ...this };
  }
}

export default Progresso;
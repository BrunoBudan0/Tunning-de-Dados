// Representa o estado de uma aula para um usuário
// Armazenado no Cassandra — tabela aula_usuario

class AulaUsuario {
  // Status possíveis de uma aula
  static STATUS = {
    NAO_INICIADA: 'nao_iniciada',
    EM_ANDAMENTO: 'em_andamento',
    CONCLUIDA:    'concluida',
  };

  constructor({ id_usuario, id_aula, status = AulaUsuario.STATUS.NAO_INICIADA }) {
    this.id_usuario = id_usuario;
    this.id_aula    = id_aula;
    this.status     = status;
  }

  static statusValido(status) {
    return Object.values(AulaUsuario.STATUS).includes(status);
  }

  toRow() {
    return { ...this };
  }
}

export default AulaUsuario;
// Representa a matrícula de um usuário em um curso
// Armazenado no Cassandra — tabela cursos_usuario

class CursoUsuario {
  // Status possíveis de uma matrícula
  static STATUS = {
    MATRICULADO:  'matriculado',
    EM_ANDAMENTO: 'em_andamento',
    CONCLUIDO:    'concluido',
    CANCELADO:    'cancelado',
  };

  constructor({ id_usuario, id_curso, status = CursoUsuario.STATUS.MATRICULADO }) {
    this.id_usuario = id_usuario;
    this.id_curso   = id_curso;
    this.status     = status;
  }

  static statusValido(status) {
    return Object.values(CursoUsuario.STATUS).includes(status);
  }

  toRow() {
    return { ...this };
  }
}

export default CursoUsuario;
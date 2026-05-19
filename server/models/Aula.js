// Representa uma aula dentro de um curso
// Armazenado no MongoDB

class Aula {
  constructor({ nome, descricao, video, IDCurso, ordem }) {
    this.nome      = nome;
    this.descricao = descricao;
    this.video     = video;
    this.IDCurso   = IDCurso;
    this.ordem     = ordem;
  }

  toDocument() {
    return { ...this };
  }
}

export default Aula;

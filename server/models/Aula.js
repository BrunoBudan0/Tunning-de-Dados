// Representa uma aula dentro de um curso
// Armazenado no MongoDB

class Aula {
  constructor({ nome, descricao, video, id_curso, ordem }) {
    this.nome      = nome;
    this.descricao = descricao;
    this.video     = video;
    this.id_curso  = id_curso;
    this.ordem     = ordem;
  }

  toDocument() {
    return { ...this };
  }
}

export default Aula;

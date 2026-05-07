// Representa um curso da plataforma
// Armazenado no MongoDB

class Course {
  constructor({ nome_curso, descricao, professor, aulas = [] }) {
    this.nome_curso = nome_curso;
    this.descricao  = descricao;
    this.professor  = professor;
    this.aulas      = aulas;
    this.createdAt  = new Date();
  }

  adicionarAula(aula) {
    this.aulas.push(aula);
  }

  toDocument() {
    return { ...this };
  }
}

export default Course;

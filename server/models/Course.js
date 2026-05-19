// Representa um curso da plataforma
// Armazenado no MongoDB

class Course {
  constructor({ IDCurso, nome_curso, descricao, professor, aulas = [] }) {
    this.IDCurso    = IDCurso;
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

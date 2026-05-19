import mongoose from '../config/mongodb.js';

const CourseSchema = new mongoose.Schema({
  IDCurso:    String,
  nome_curso: String,
  descricao:  String,
  professor:  String,
  aulas:      Array,
  createdAt:  Date
});

// Força a collection 'cursos' em vez de 'courses'
const CourseModel = mongoose.model('Course', CourseSchema, 'cursos');

class CourseDAO {
  async findAll() {
    return await CourseModel.find({});
  }

  // Procura primeiro pelo IDCurso (identificador lógico, ex: "curso_1")
  // e, se não achar e o valor parecer um ObjectId, tenta pelo _id.
  async findById(id) {
    const porIDCurso = await CourseModel.findOne({ IDCurso: id });
    if (porIDCurso) return porIDCurso;

    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      return await CourseModel.findById(id);
    }
    return null;
  }

  async save(courseInstance) {
    const doc = new CourseModel(courseInstance.toDocument());
    return await doc.save();
  }

  async delete(id) {
    const porIDCurso = await CourseModel.findOneAndDelete({ IDCurso: id });
    if (porIDCurso) return porIDCurso;

    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      return await CourseModel.findByIdAndDelete(id);
    }
    return null;
  }
}

export default new CourseDAO();

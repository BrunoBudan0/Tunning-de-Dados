import mongoose from '../config/mongodb.js';

const CourseSchema = new mongoose.Schema({
  nome_curso: String,
  descricao:  String,
  professor:  String,
  IDCurso: String
});

// Força a collection 'cursos' em vez de 'courses'
const CourseModel = mongoose.model('Course', CourseSchema, 'cursos');

class CourseDAO {
  async findAll() {
    return await CourseModel.find({});
  }

  async findById(id) {
    return await CourseModel.findById(id);
  }

  async save(courseInstance) {
    const doc = new CourseModel(courseInstance.toDocument());
    return await doc.save();
  }

  async delete(id) {
    return await CourseModel.findByIdAndDelete(id);
  }
}

export default new CourseDAO();
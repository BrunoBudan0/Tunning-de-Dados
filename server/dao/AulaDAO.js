import mongoose from '../config/mongodb.js';

const AulaSchema = new mongoose.Schema({
  nome:      String,
  descricao: String,
  video:     String,
  IDCurso:   String,   // ← nome real no banco
  ordem:     Number
});

// Terceiro parâmetro = nome exato da collection no MongoDB
const AulaModel = mongoose.model('Aula', AulaSchema, 'aulas');

class AulaDAO {
  async findByCurso(IDCurso) {
    return await AulaModel.find({ IDCurso }).sort({ ordem: 1 });
  }

  async findById(id) {
    return await AulaModel.findById(id);
  }

  async save(aulaInstance) {
    const doc = new AulaModel(aulaInstance.toDocument());
    return await doc.save();
  }

  async delete(id) {
    return await AulaModel.findByIdAndDelete(id);
  }
}

export default new AulaDAO();
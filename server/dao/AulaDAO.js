// Acesso ao banco de dados de aulas
// Banco: MongoDB

import mongoose from '../config/mongodb.js';

const AulaSchema = new mongoose.Schema({
  nome:      String,
  descricao: String,
  video:     String,
  id_curso:  String,
  ordem:     Number
});

const AulaModel = mongoose.model('Aula', AulaSchema);

class AulaDAO {

  async findByCurso(id_curso) {
    return await AulaModel.find({ id_curso }).sort({ ordem: 1 });
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

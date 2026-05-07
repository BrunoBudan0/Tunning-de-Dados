import UserDAO from '../dao/UserDAO.js';
import User    from '../models/User.js';

class UserController {

  // GET /api/users
  async getAll(req, res) {
    try {
      const users = await UserDAO.findAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // GET /api/users/:id
  async getById(req, res) {
    try {
      const user = await UserDAO.findById(req.params.id);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // POST /api/users
  async create(req, res) {
    try {
      const user  = new User(req.body);
      const saved = await UserDAO.save(user);
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // DELETE /api/users/:id
  async remove(req, res) {
    try {
      await UserDAO.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default new UserController();

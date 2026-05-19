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
      const message = err.code === '23505'
        ? 'Este email já está cadastrado.'
        : err.message;
      res.status(400).json({ error: message });
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

  // POST /api/users/login
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const user = await UserDAO.login(email, senha);
      if (!user) return res.status(401).json({ error: 'Email ou senha inválidos.' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // GET /api/users/email/:email
  async findByEmail(req, res) {
    try {
      const user = await UserDAO.findByEmail(req.params.email);
      if (!user) return res.status(404).json({ error: 'Nenhuma conta foi encontrada com este email.' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // PATCH /api/users/:id/senha
  async updatePassword(req, res) {
    try {
      const { senha } = req.body;
      await UserDAO.updatePassword(req.params.id, senha);
      res.json({ message: 'Senha alterada com sucesso.' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export default new UserController();

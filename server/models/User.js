// Representa um usuário da plataforma
// Armazenado no Supabase (PostgreSQL)

class User {
  constructor({ nome, email, senha, telefone }) {
    this.nome     = nome;
    this.email    = email;
    this.senha    = senha;
    this.telefone = telefone;
  }

  toRecord() {
    return { ...this };
  }
}

export default User;

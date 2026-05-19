const BASE_URL = 'http://localhost:3000/api';

export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error('Erro ao buscar usuários');
  return res.json();
}

export async function getUserById(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  if (!res.ok) throw new Error('Usuário não encontrado');
  return res.json();
}

export async function createUser(userData) {
  const res = await fetch(`${BASE_URL}/users`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(userData)
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Erro ao criar usuário');
  }
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao remover usuário');
}

export async function login(email, senha) {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, senha })
  });
  if (res.status === 401) throw new Error('Email ou senha inválidos.');
  if (!res.ok) throw new Error('Não foi possível fazer login. Tente novamente.');
  return res.json();
}

export async function buscarPorEmail(email) {
  const res = await fetch(`${BASE_URL}/users/email/${encodeURIComponent(email)}`);
  if (res.status === 404) throw new Error('Nenhuma conta foi encontrada com este email.');
  if (!res.ok) throw new Error('Não foi possível consultar o banco agora.');
  return res.json();
}

export async function atualizarSenha(id, senha) {
  const res = await fetch(`${BASE_URL}/users/${id}/senha`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ senha })
  });
  if (!res.ok) throw new Error('Erro ao trocar senha.');
}

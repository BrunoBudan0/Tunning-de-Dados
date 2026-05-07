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
  if (!res.ok) throw new Error('Erro ao criar usuário');
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao remover usuário');
}

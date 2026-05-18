const BASE_URL = 'http://localhost:3000/api';

async function readError(res, fallback) {
  try {
    const body = await res.json();
    return body.error || fallback;
  } catch {
    return fallback;
  }
}

export async function getAulasPorCurso(IDCurso) {
  const res = await fetch(`${BASE_URL}/aulas/curso/${IDCurso}`);
  if (!res.ok) throw new Error(await readError(res, 'Erro ao buscar aulas'));
  return res.json();
}

export async function getAulaById(id) {
  const res = await fetch(`${BASE_URL}/aulas/${id}`);
  if (!res.ok) throw new Error(await readError(res, 'Aula não encontrada'));
  return res.json();
}

export async function createAula(aulaData) {
  const res = await fetch(`${BASE_URL}/aulas`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(aulaData)
  });
  if (!res.ok) throw new Error(await readError(res, 'Erro ao criar aula'));
  return res.json();
}

export async function deleteAula(id) {
  const res = await fetch(`${BASE_URL}/aulas/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await readError(res, 'Erro ao remover aula'));
}

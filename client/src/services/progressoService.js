const BASE_URL = 'http://localhost:3000/api';

async function readError(res, fallback) {
  try {
    const body = await res.json();
    return body.error || fallback;
  } catch {
    return fallback;
  }
}

export async function getProgresso(id_usuario, id_curso) {
  const res = await fetch(`${BASE_URL}/progresso/${id_usuario}/${id_curso}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await readError(res, 'Erro ao buscar progresso'));
  return res.json();
}

export async function getMatriculas(id_usuario) {
  const res = await fetch(`${BASE_URL}/progresso/matriculas/${id_usuario}`);
  if (!res.ok) throw new Error(await readError(res, 'Erro ao buscar matrículas'));
  return res.json();
}

export async function getAulasUsuario(id_usuario) {
  const res = await fetch(`${BASE_URL}/progresso/aulas/${id_usuario}`);
  if (!res.ok) throw new Error(await readError(res, 'Erro ao buscar status das aulas'));
  return res.json();
}

export async function salvarProgresso(id_usuario, id_curso, progresso) {
  const res = await fetch(`${BASE_URL}/progresso`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ id_usuario, id_curso, progresso })
  });
  if (!res.ok) throw new Error(await readError(res, 'Erro ao salvar progresso'));
  return res.json();
}

export async function matricular(id_usuario, id_curso, ids_aulas = []) {
  const res = await fetch(`${BASE_URL}/progresso/matricular`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ id_usuario, id_curso, ids_aulas })
  });
  if (!res.ok) throw new Error(await readError(res, 'Erro ao matricular'));
  return res.json();
}

export async function concluirAula(id_usuario, id_aula, id_curso, progresso_atual) {
  const res = await fetch(`${BASE_URL}/progresso/aula`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ id_usuario, id_aula, id_curso, progresso_atual })
  });
  if (!res.ok) throw new Error(await readError(res, 'Erro ao concluir aula'));
  return res.json();
}

const BASE_URL = 'http://localhost:3000/api';

export async function getProgresso(id_usuario, id_curso) {
  const res = await fetch(`${BASE_URL}/progresso/${id_usuario}/${id_curso}`);
  if (!res.ok) throw new Error('Erro ao buscar progresso');
  return res.json();
}

export async function salvarProgresso(id_usuario, id_curso, progresso) {
  const res = await fetch(`${BASE_URL}/progresso`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ id_usuario, id_curso, progresso })
  });
  if (!res.ok) throw new Error('Erro ao salvar progresso');
  return res.json();
}

export async function matricular(id_usuario, id_curso) {
  const res = await fetch(`${BASE_URL}/progresso/matricular`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ id_usuario, id_curso })
  });
  if (!res.ok) throw new Error('Erro ao matricular');
  return res.json();
}

export async function concluirAula(id_usuario, id_aula) {
  const res = await fetch(`${BASE_URL}/progresso/aula`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ id_usuario, id_aula })
  });
  if (!res.ok) throw new Error('Erro ao concluir aula');
  return res.json();
}

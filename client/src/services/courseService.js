const BASE_URL = 'http://localhost:3000/api';

async function readError(res, fallback) {
  try {
    const body = await res.json();
    return body.error || fallback;
  } catch {
    return fallback;
  }
}

export async function getCourses() {
  const res = await fetch(`${BASE_URL}/courses`);
  if (!res.ok) throw new Error(await readError(res, 'Erro ao buscar cursos'));
  return res.json();
}

export async function getCourseById(id) {
  const res = await fetch(`${BASE_URL}/courses/${id}`);
  if (!res.ok) throw new Error(await readError(res, 'Curso não encontrado'));
  return res.json();
}

export async function createCourse(courseData) {
  const res = await fetch(`${BASE_URL}/courses`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(courseData)
  });
  if (!res.ok) throw new Error(await readError(res, 'Erro ao criar curso'));
  return res.json();
}

export async function deleteCourse(id) {
  const res = await fetch(`${BASE_URL}/courses/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await readError(res, 'Erro ao remover curso'));
}

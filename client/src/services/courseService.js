const BASE_URL = 'http://localhost:3000/api';

export async function getCourses() {
  const res = await fetch(`${BASE_URL}/courses`);
  if (!res.ok) throw new Error('Erro ao buscar cursos');
  return res.json();
}

export async function getCourseById(id) {
  const res = await fetch(`${BASE_URL}/courses/${id}`);
  if (!res.ok) throw new Error('Curso não encontrado');
  return res.json();
}

export async function createCourse(courseData) {
  const res = await fetch(`${BASE_URL}/courses`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(courseData)
  });
  if (!res.ok) throw new Error('Erro ao criar curso');
  return res.json();
}

export async function deleteCourse(id) {
  const res = await fetch(`${BASE_URL}/courses/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao remover curso');
}

import { useEffect, useState } from 'react'
import './Cursos.css'
import { getCourses } from '../../services/courseService'
import { getAulasPorCurso } from '../../services/aulaService'
import { matricular, getMatriculas } from '../../services/progressoService'

function Cursos({ usuario, irParaDetalhe, sair }) {
  const [cursos, setCursos] = useState([])
  const [matriculas, setMatriculas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [acaoCarregando, setAcaoCarregando] = useState(null)

  async function carregarDados() {
    setErro('')
    setCarregando(true)
    try {
      const [listaCursos, listaMatriculas] = await Promise.all([
        getCourses(),
        getMatriculas(usuario.id),
      ])
      setCursos(listaCursos)
      setMatriculas(listaMatriculas)
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  function estaMatriculado(idCurso) {
    return matriculas.some((m) => String(m.id_curso) === String(idCurso))
  }

  async function handleMatricular(curso) {
    setAcaoCarregando(curso.IDCurso)
    setErro('')
    try {
      const aulas = await getAulasPorCurso(curso.IDCurso)
      const idsAulas = aulas.map((a) => String(a._id))
      await matricular(usuario.id, curso.IDCurso, idsAulas)
      await carregarDados()
    } catch (err) {
      setErro(err.message)
    } finally {
      setAcaoCarregando(null)
    }
  }

  return (
    <div className="cursos-page">
      <header className="cursos-header">
        <div className="cursos-logo">
          <span>C</span>
          <span className="cursos-brand">Cursos</span>
        </div>
        <div className="cursos-user">
          <span>Olá, {usuario.nome}</span>
          <button type="button" onClick={sair}>Sair</button>
        </div>
      </header>

      <main className="cursos-main">
        <h1>Cursos disponíveis</h1>

        {erro && <p className="cursos-error">{erro}</p>}

        {carregando && <p>Carregando cursos...</p>}

        {!carregando && cursos.length === 0 && (
          <p>Nenhum curso disponível ainda.</p>
        )}

        <div className="cursos-grid">
          {cursos.map((curso) => {
            const matriculado = estaMatriculado(curso.IDCurso)
            return (
              <div key={curso.IDCurso || curso._id} className="curso-card">
                <h2>{curso.nome_curso}</h2>
                <p className="curso-prof">Prof. {curso.professor}</p>
                <p className="curso-desc">{curso.descricao}</p>

                <div className="curso-actions">
                  {matriculado ? (
                    <button
                      type="button"
                      className="curso-button primary"
                      onClick={() => irParaDetalhe(curso.IDCurso)}
                    >
                      Acessar
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="curso-button"
                      onClick={() => handleMatricular(curso)}
                      disabled={acaoCarregando === curso.IDCurso}
                    >
                      {acaoCarregando === curso.IDCurso ? 'Matriculando...' : 'Matricular'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default Cursos

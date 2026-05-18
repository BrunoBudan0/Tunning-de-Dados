import { useEffect, useState } from 'react'
import './CursoDetalhe.css'
import { getCourseById } from '../../services/courseService'
import { getAulasPorCurso } from '../../services/aulaService'
import {
  getProgresso,
  getAulasUsuario,
  concluirAula,
} from '../../services/progressoService'

function CursoDetalhe({ usuario, idCurso, voltar }) {
  const [curso, setCurso] = useState(null)
  const [aulas, setAulas] = useState([])
  const [statusAulas, setStatusAulas] = useState({})
  const [progresso, setProgresso] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [aulaCarregando, setAulaCarregando] = useState(null)

  async function carregarDados() {
    setErro('')
    setCarregando(true)
    try {
      const [cursoData, aulasData, progressoData, aulasUsuarioData] = await Promise.all([
        getCourseById(idCurso),
        getAulasPorCurso(idCurso),
        getProgresso(usuario.id, idCurso),
        getAulasUsuario(usuario.id),
      ])

      setCurso(cursoData)
      setAulas(aulasData)
      setProgresso(progressoData?.progresso || 0)

      const mapa = {}
      aulasUsuarioData.forEach((au) => {
        mapa[String(au.id_aula)] = au.status
      })
      setStatusAulas(mapa)
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [idCurso])

  async function handleConcluirAula(aula) {
    setAulaCarregando(aula._id)
    setErro('')
    try {
      const total = aulas.length || 1
      const concluidasAtuais = aulas.filter(
        (a) =>
          statusAulas[String(a._id)] === 'concluida' ||
          String(a._id) === String(aula._id)
      ).length
      const novoProgresso = Math.round((concluidasAtuais / total) * 100)

      await concluirAula(usuario.id, String(aula._id), idCurso, novoProgresso)
      await carregarDados()
    } catch (err) {
      setErro(err.message)
    } finally {
      setAulaCarregando(null)
    }
  }

  if (carregando) {
    return (
      <div className="detalhe-page">
        <p style={{ padding: 32 }}>Carregando...</p>
      </div>
    )
  }

  if (!curso) {
    return (
      <div className="detalhe-page">
        <p style={{ padding: 32 }}>Curso não encontrado.</p>
        <button onClick={voltar}>Voltar</button>
      </div>
    )
  }

  return (
    <div className="detalhe-page">
      <header className="detalhe-header">
        <button type="button" className="detalhe-back" onClick={voltar}>
          ← Voltar
        </button>
        <span>Olá, {usuario.nome}</span>
      </header>

      <main className="detalhe-main">
        <h1>{curso.nome_curso}</h1>
        <p className="detalhe-prof">Prof. {curso.professor}</p>
        <p className="detalhe-desc">{curso.descricao}</p>

        <div className="detalhe-progresso">
          <div className="detalhe-progresso-bar">
            <div
              className="detalhe-progresso-fill"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <span>{progresso}% concluído</span>
        </div>

        {erro && <p className="detalhe-error">{erro}</p>}

        <h2>Aulas</h2>

        {aulas.length === 0 && <p>Este curso ainda não tem aulas.</p>}

        <ul className="aulas-list">
          {aulas.map((aula) => {
            const status = statusAulas[String(aula._id)] || 'nao_iniciada'
            const concluida = status === 'concluida'
            return (
              <li key={aula._id} className={`aula-item ${concluida ? 'concluida' : ''}`}>
                <div className="aula-info">
                  <span className="aula-ordem">{aula.ordem}.</span>
                  <div>
                    <h3>{aula.nome}</h3>
                    <p>{aula.descricao}</p>
                    {aula.video && (
                      <a href={aula.video} target="_blank" rel="noopener noreferrer">
                        Assistir vídeo
                      </a>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="aula-button"
                  onClick={() => handleConcluirAula(aula)}
                  disabled={concluida || aulaCarregando === aula._id}
                >
                  {concluida
                    ? '✓ Concluída'
                    : aulaCarregando === aula._id
                    ? 'Salvando...'
                    : 'Concluir'}
                </button>
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  )
}

export default CursoDetalhe

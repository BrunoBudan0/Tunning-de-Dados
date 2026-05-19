import { useState, useEffect } from 'react'
import './DetalheCurso.css'
import Header from '../../components/Header/Header'
import BottomNav from '../../components/BottomNav/BottomNav'
import { getCourseById } from '../../services/courseService'
import { getAulasPorCurso } from '../../services/aulaService'
import {
  getMatriculas,
  getProgresso,
  getAulasUsuario,
  matricular,
  concluirAula,
} from '../../services/progressoService'

// Defaults estáticos para o layout — campos que ainda não existem
// no schema do MongoDB. Quando o back-end for enriquecido, basta
// remover daqui e os dados reais virão por ...raw.
// Extrai até 2 iniciais do nome completo
function getIniciais(nome = '') {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  if (partes.length === 1) return partes[0][0].toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

function enriquecerCurso(raw) {
  return {
    ...raw,
    descricao:    raw.descricao    ?? 'Domine este curso do básico ao avançado.',
    aprendizados: raw.aprendizados ?? [
      'Fundamentos sólidos', 'Projetos práticos',
      'Boas práticas de código', 'Performance e otimização',
    ],
    requisitos: raw.requisitos ?? [
      'Conhecimentos básicos de programação',
      'Computador com acesso à internet',
      'Vontade de aprender!',
    ],
    instrutor: {
      nome:          raw.instrutor?.nome          ?? raw.professor ?? 'Instrutor',
      especialidade: raw.instrutor?.especialidade ?? 'Especialista na área',
      avaliacao:     raw.instrutor?.avaliacao     ?? raw.avaliacao ?? 4.9,
      alunos:        raw.instrutor?.alunos        ?? raw.alunos    ?? 0,
      bio:           raw.instrutor?.bio           ?? 'Profissional experiente no mercado.',
    },
  }
}

function IconCheck({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function DetalheCurso({ cursoInicial, usuario, aoNavegar, aoVoltar }) {
  const [curso, setCurso]               = useState(cursoInicial ? enriquecerCurso(cursoInicial) : null)
  const [aulas, setAulas]               = useState([])
  const [statusAulas, setStatusAulas]   = useState({})
  const [matriculado, setMatriculado]   = useState(false)
  const [progresso, setProgresso]       = useState(0)
  const [carregando, setCarregando]     = useState(!cursoInicial)
  const [erro, setErro]                 = useState('')
  const [abaAtiva, setAbaAtiva]         = useState('visao-geral')
  const [acaoCarregando, setAcaoCarregando] = useState(null)

  // Identificador real do curso no Mongo. Quando vem do catálogo,
  // já temos IDCurso ("curso_1"); senão tenta _id como fallback.
  const idCurso = curso?.IDCurso ?? cursoInicial?.IDCurso ?? cursoInicial?._id

  // Busca dados do curso se não veio do catálogo (navegação direta)
  useEffect(() => {
    if (cursoInicial) return
    const id = new URLSearchParams(window.location.search).get('id') ?? 'curso_1'
    getCourseById(id)
      .then((data) => setCurso(enriquecerCurso(data)))
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false))
  }, [cursoInicial])

  // Carrega aulas, matrícula e progresso do usuário
  async function carregarEstadoUsuario() {
    if (!idCurso || !usuario?.id) return
    try {
      const [aulasData, matriculas, aulasUsuarioData] = await Promise.all([
        getAulasPorCurso(idCurso),
        getMatriculas(usuario.id),
        getAulasUsuario(usuario.id),
      ])
      setAulas(aulasData)

      const estouMatriculado = matriculas.some(
        (m) => String(m.id_curso) === String(idCurso)
      )
      setMatriculado(estouMatriculado)

      if (estouMatriculado) {
        const p = await getProgresso(usuario.id, idCurso)
        setProgresso(p?.progresso ?? 0)
      } else {
        setProgresso(0)
      }

      const mapa = {}
      aulasUsuarioData.forEach((au) => {
        mapa[String(au.id_aula)] = au.status
      })
      setStatusAulas(mapa)
    } catch (err) {
      setErro(err.message)
    }
  }

  useEffect(() => {
    carregarEstadoUsuario()
  }, [idCurso, usuario?.id])

  // Matricula o usuário neste curso
  async function handleMatricular() {
    if (!usuario?.id || !idCurso) {
      setErro('Faça login para se matricular.')
      return
    }
    setAcaoCarregando('matricular')
    setErro('')
    try {
      const idsAulas = aulas.map((a) => String(a._id))
      await matricular(usuario.id, idCurso, idsAulas)
      await carregarEstadoUsuario()
    } catch (err) {
      setErro(err.message)
    } finally {
      setAcaoCarregando(null)
    }
  }

  // Marca uma aula como concluída
  async function handleConcluirAula(aula) {
    if (!matriculado) {
      setErro('Matricule-se no curso antes de concluir aulas.')
      return
    }
    setAcaoCarregando(aula._id)
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
      await carregarEstadoUsuario()
    } catch (err) {
      setErro(err.message)
    } finally {
      setAcaoCarregando(null)
    }
  }

  if (carregando) {
    return (
      <div className="det-pagina">
        <Header titulo="Detalhes do Curso" />
        <div className="det-carregando">
          <div className="det-spinner" />
          <span>Carregando curso...</span>
        </div>
        <BottomNav paginaAtual="explorar" aoNavegar={aoNavegar} />
      </div>
    )
  }

  if (erro && !curso) {
    return (
      <div className="det-pagina">
        <Header titulo="Detalhes do Curso" />
        <div className="det-erro">
          <p>Não foi possível carregar o curso.</p>
          <span>{erro}</span>
          <button onClick={aoVoltar}>← Voltar ao catálogo</button>
        </div>
        <BottomNav paginaAtual="explorar" aoNavegar={aoNavegar} />
      </div>
    )
  }

  // ── Aba: Visão Geral ──
  function renderVisaoGeral() {
    const metade = Math.ceil(curso.aprendizados.length / 2)
    const col1   = curso.aprendizados.slice(0, metade)
    const col2   = curso.aprendizados.slice(metade)

    return (
      <>
        <section className="det-secao">
          <h2 className="det-secao-titulo">O que você vai aprender</h2>
          <div className="det-aprendizados-grid">
            <ul className="det-aprendizados-col">
              {col1.map((item, i) => (
                <li key={i}><IconCheck /><span>{item}</span></li>
              ))}
            </ul>
            <ul className="det-aprendizados-col">
              {col2.map((item, i) => (
                <li key={i}><IconCheck /><span>{item}</span></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="det-secao">
          <h2 className="det-secao-titulo">Requisitos</h2>
          <ul className="det-requisitos">
            {curso.requisitos.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </section>

        <section className="det-secao">
          <div className="det-instrutor">
            <div className="det-instrutor-avatar">
              {getIniciais(curso.instrutor.nome)}
            </div>
            <div>
              <h3 className="det-instrutor-nome">{curso.instrutor.nome}</h3>
              <p className="det-instrutor-especialidade">{curso.instrutor.especialidade}</p>
            </div>
          </div>
          <p className="det-instrutor-bio">{curso.instrutor.bio}</p>
        </section>
      </>
    )
  }

  // ── Aba: Conteúdo (aulas reais do MongoDB) ──
  function renderConteudo() {
    if (aulas.length === 0) {
      return (
        <section className="det-secao">
          <h2 className="det-secao-titulo">Conteúdo do curso</h2>
          <p>Este curso ainda não tem aulas cadastradas.</p>
        </section>
      )
    }

    return (
      <section className="det-secao">
        <h2 className="det-secao-titulo">
          Conteúdo do curso
          <span className="det-secao-badge">{aulas.length} aulas</span>
        </h2>

        <ul className="det-aulas-lista" style={{ listStyle: 'none', padding: 0 }}>
          {aulas.map((aula) => {
            const status = statusAulas[String(aula._id)] ?? 'nao_iniciada'
            const concluida = status === 'concluida'
            return (
              <li
                key={aula._id}
                className="det-aula-item"
                style={{
                  background: concluida ? '#f0fdf4' : '#fff',
                  border: concluida ? '1px solid #86efac' : '1px solid #e5e7eb',
                  borderRadius: 8,
                  padding: '12px 16px',
                  marginBottom: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  <span style={{ fontWeight: 600, color: '#6b7280', minWidth: 24 }}>
                    {aula.ordem}.
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{aula.nome}</div>
                    {aula.descricao && (
                      <div style={{ fontSize: 13, color: '#6b7280' }}>{aula.descricao}</div>
                    )}
                    {aula.video && (
                      <a
                        href={aula.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 13, color: '#7c3aed', textDecoration: 'none' }}
                      >
                        ▶ Assistir vídeo
                      </a>
                    )}
                  </div>
                </div>

                {matriculado && (
                  <button
                    type="button"
                    onClick={() => handleConcluirAula(aula)}
                    disabled={concluida || acaoCarregando === aula._id}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 6,
                      border: 'none',
                      background: concluida ? '#86efac' : '#7c3aed',
                      color: concluida ? '#166534' : '#fff',
                      cursor: concluida ? 'default' : 'pointer',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {concluida
                      ? '✓ Concluída'
                      : acaoCarregando === aula._id
                      ? 'Salvando...'
                      : 'Concluir'}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    )
  }

  return (
    <div className="det-pagina">
      <Header titulo="Detalhes do Curso" />

      <div className="det-hero">
        <div className="det-hero-inner">
          <div className="det-hero-conteudo">
            <button className="det-voltar" onClick={aoVoltar} aria-label="Voltar ao catálogo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Voltar
            </button>

            {curso.categoria && (
              <div className="det-badges">
                <span className="det-badge det-badge--cat">{curso.categoria}</span>
                {curso.nivel && <span className="det-badge det-badge--nivel">{curso.nivel}</span>}
              </div>
            )}

            <h1 className="det-titulo">{curso.nome_curso}</h1>
            <p className="det-descricao">{curso.descricao}</p>

            {matriculado && (
              <div style={{
                margin: '16px 0',
                padding: '12px 16px',
                background: 'rgba(124, 58, 237, 0.1)',
                borderRadius: 8,
                color: '#fff',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                  <span>Seu progresso</span>
                  <strong>{progresso}%</strong>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${progresso}%`, height: '100%', background: '#7c3aed', transition: 'width 0.3s' }} />
                </div>
              </div>
            )}

            <div className="det-hero-instrutor">
              <div className="det-hero-instrutor-avatar">
                {getIniciais(curso.instrutor.nome)}
              </div>
              <div>
                <span className="det-hero-instrutor-nome">{curso.instrutor.nome}</span>
                <span className="det-hero-instrutor-cargo">Instrutor principal</span>
              </div>
            </div>
          </div>

          {/* Card lateral de matrícula */}
          <div className="det-card-compra">
            {curso.thumbnail && (
              <img
                src={curso.thumbnail}
                alt={curso.nome_curso}
                className="det-card-thumb"
              />
            )}

            {erro && (
              <div style={{
                padding: '10px 12px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                borderRadius: 6,
                fontSize: 13,
                marginBottom: 12,
              }}>
                {erro}
              </div>
            )}

            <button
              className="det-btn-principal"
              onClick={matriculado ? () => setAbaAtiva('conteudo') : handleMatricular}
              disabled={acaoCarregando === 'matricular'}
            >
              {acaoCarregando === 'matricular'
                ? 'Matriculando...'
                : matriculado
                ? (progresso > 0 ? 'Continuar assistindo' : 'Começar curso')
                : 'Matricular gratuitamente'}
            </button>

            {matriculado && (
              <p style={{ fontSize: 13, color: '#16a34a', textAlign: 'center', margin: '8px 0 0' }}>
                ✓ Você está matriculado neste curso
              </p>
            )}

            <ul className="det-beneficios">
              {[
                'Acesso vitalício',
                'Certificado de conclusão',
                'Suporte do instrutor',
                'Atualizações inclusas',
              ].map((b) => (
                <li key={b}>
                  <IconCheck size={15} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="det-abas-wrapper">
        <div className="det-abas">
          {[
            { id: 'visao-geral', label: 'Visão Geral'  },
            { id: 'conteudo',    label: 'Conteúdo'     },
          ].map((aba) => (
            <button
              key={aba.id}
              className={`det-aba ${abaAtiva === aba.id ? 'det-aba--ativa' : ''}`}
              onClick={() => setAbaAtiva(aba.id)}
            >
              {aba.label}
            </button>
          ))}
        </div>
      </div>

      <main className="det-conteudo">
        {abaAtiva === 'visao-geral' && renderVisaoGeral()}
        {abaAtiva === 'conteudo'    && renderConteudo()}
      </main>

      <div className="det-spacer-bottom" aria-hidden="true" />
      <BottomNav paginaAtual="explorar" aoNavegar={aoNavegar} />
    </div>
  )
}

export default DetalheCurso

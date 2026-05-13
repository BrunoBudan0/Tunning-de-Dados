import { useState, useEffect } from 'react'
import './DetalheCurso.css'
import Header from '../../components/Header/Header'
import BottomNav from '../../components/BottomNav/BottomNav'
import { getCourseById } from '../../services/courseService'

// ─────────────────────────────────────────────────────────────
// Campos que precisam ser adicionados ao schema Course.js
// (além dos já existentes no Catálogo):
//
//   totalAulas     : Number
//   aprendizados   : [String]   → "O que você vai aprender"
//   requisitos     : [String]
//   instrutor: {
//     bio          : String
//     especialidade: String
//   }
//   modulos: [{     → aba "Conteúdo"
//     titulo: String,
//     aulas : [{ titulo: String, duracao: String, gratuita: Boolean }]
//   }]
// ─────────────────────────────────────────────────────────────

// Enriquece o curso vindo do catálogo (ou do back-end)
// com os campos extras de detalhe, quando ainda não existem.
function enriquecerCurso(raw) {
  return {
    ...raw,
    totalAulas:   raw.totalAulas   ?? 187,
    descricao:    raw.descricao    ?? 'Domine este curso do básico ao avançado. Construa projetos reais com as melhores práticas do mercado.',
    aprendizados: raw.aprendizados ?? [
      'Fundamentos sólidos', 'Projetos práticos',
      'Boas práticas de código', 'Hooks avançados',
      'Performance e otimização', 'Deploy em produção',
      'Testes automatizados', 'Trabalho em equipe',
    ],
    requisitos: raw.requisitos ?? [
      'Conhecimentos básicos de programação',
      'Computador com acesso à internet',
      'Vontade de aprender!',
    ],
    instrutor: {
      nome:          raw.instrutor?.nome          ?? raw.professor ?? 'Instrutor',
      avatar:        raw.instrutor?.avatar        ?? `https://i.pravatar.cc/80?u=${raw._id}`,
      especialidade: raw.instrutor?.especialidade ?? 'Especialista na área',
      avaliacao:     raw.instrutor?.avaliacao     ?? raw.avaliacao ?? 4.9,
      alunos:        raw.instrutor?.alunos        ?? raw.alunos    ?? 0,
      bio:           raw.instrutor?.bio           ?? 'Profissional com mais de 8 anos de experiência no mercado, com passagem por grandes empresas de tecnologia. Apaixonado por ensino e pela democratização do conhecimento.',
    },
    modulos: raw.modulos ?? [
      {
        titulo: 'Módulo 1 — Introdução',
        aulas: [
          { titulo: 'Apresentação do curso', duracao: '05:20', gratuita: true  },
          { titulo: 'Configurando o ambiente', duracao: '12:40', gratuita: true  },
          { titulo: 'Primeiro projeto',        duracao: '18:10', gratuita: false },
        ],
      },
      {
        titulo: 'Módulo 2 — Fundamentos',
        aulas: [
          { titulo: 'Conceitos essenciais', duracao: '22:00', gratuita: false },
          { titulo: 'Exercícios práticos',  duracao: '15:30', gratuita: false },
          { titulo: 'Projeto do módulo',    duracao: '45:00', gratuita: false },
        ],
      },
      {
        titulo: 'Módulo 3 — Avançado',
        aulas: [
          { titulo: 'Técnicas avançadas',   duracao: '30:00', gratuita: false },
          { titulo: 'Performance',          duracao: '25:00', gratuita: false },
          { titulo: 'Projeto final',        duracao: '60:00', gratuita: false },
        ],
      },
    ],
  }
}

// ── Ícone de check roxo ──
function IconCheck({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function DetalheCurso({ cursoInicial, aoNavegar, aoVoltar }) {
  const [curso, setCurso]       = useState(cursoInicial ? enriquecerCurso(cursoInicial) : null)
  const [carregando, setCarregando] = useState(!cursoInicial)
  const [erro, setErro]         = useState('')
  const [abaAtiva, setAbaAtiva] = useState('visao-geral')
  const [moduloAberto, setModuloAberto] = useState(null)

  // Só busca do back-end se não veio do catálogo (navegação direta por URL futura)
  useEffect(() => {
    if (cursoInicial) return
    const id = new URLSearchParams(window.location.search).get('id') ?? '1'
    getCourseById(id)
      .then((data) => setCurso(enriquecerCurso(data)))
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false))
  }, [cursoInicial])

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

  if (erro || !curso) {
    return (
      <div className="det-pagina">
        <Header titulo="Detalhes do Curso" />
        <div className="det-erro">
          <p>Não foi possível carregar o curso.</p>
          <button onClick={aoVoltar}>← Voltar ao catálogo</button>
        </div>
        <BottomNav paginaAtual="explorar" aoNavegar={aoNavegar} />
      </div>
    )
  }

  const desconto = curso.precoOriginal > curso.preco
    ? Math.round((1 - curso.preco / curso.precoOriginal) * 100)
    : null

  // ── Aba: Visão Geral ──
  function renderVisaoGeral() {
    const metade = Math.ceil(curso.aprendizados.length / 2)
    const col1   = curso.aprendizados.slice(0, metade)
    const col2   = curso.aprendizados.slice(metade)

    return (
      <>
        {/* O que você vai aprender */}
        <section className="det-secao">
          <h2 className="det-secao-titulo">O que você vai aprender</h2>
          <div className="det-aprendizados-grid">
            <ul className="det-aprendizados-col">
              {col1.map((item, i) => (
                <li key={i}>
                  <IconCheck />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <ul className="det-aprendizados-col">
              {col2.map((item, i) => (
                <li key={i}>
                  <IconCheck />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Requisitos */}
        <section className="det-secao">
          <h2 className="det-secao-titulo">Requisitos</h2>
          <ul className="det-requisitos">
            {curso.requisitos.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </section>

        {/* Instrutor */}
        <section className="det-secao">
          <div className="det-instrutor">
            <img src={curso.instrutor.avatar} alt={curso.instrutor.nome} className="det-instrutor-avatar" />
            <div>
              <h3 className="det-instrutor-nome">{curso.instrutor.nome}</h3>
              <p className="det-instrutor-especialidade">{curso.instrutor.especialidade}</p>
              <div className="det-instrutor-meta">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>{curso.instrutor.avaliacao}</span>
                <span className="det-dot">•</span>
                <span>{curso.instrutor.alunos.toLocaleString('pt-BR')} alunos</span>
              </div>
            </div>
          </div>
          <p className="det-instrutor-bio">{curso.instrutor.bio}</p>
        </section>
      </>
    )
  }

  // ── Aba: Conteúdo ──
  function renderConteudo() {
    return (
      <section className="det-secao">
        <h2 className="det-secao-titulo">
          Conteúdo do curso
          <span className="det-secao-badge">
            {curso.totalAulas} aulas • {curso.duracao}
          </span>
        </h2>

        <div className="det-modulos">
          {curso.modulos.map((mod, mi) => (
            <div key={mi} className="det-modulo">
              <button
                className="det-modulo-header"
                onClick={() => setModuloAberto(moduloAberto === mi ? null : mi)}
                aria-expanded={moduloAberto === mi}
              >
                <span className="det-modulo-titulo">{mod.titulo}</span>
                <div className="det-modulo-header-right">
                  <span className="det-modulo-count">{mod.aulas.length} aulas</span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: moduloAberto === mi ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              {moduloAberto === mi && (
                <ul className="det-aulas-lista">
                  {mod.aulas.map((aula, ai) => (
                    <li key={ai} className="det-aula-item">
                      <div className="det-aula-esquerda">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
                        </svg>
                        <span>{aula.titulo}</span>
                        {aula.gratuita && <span className="det-aula-gratis">Grátis</span>}
                      </div>
                      <span className="det-aula-duracao">{aula.duracao}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ── Aba: Avaliações ──
  function renderAvaliacoes() {
    return (
      <section className="det-secao det-avaliacoes-placeholder">
        <div className="det-rating-destaque">
          <span className="det-rating-num">{curso.avaliacao.toFixed(1)}</span>
          <div>
            <div className="det-estrelas">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill={i < Math.round(curso.avaliacao) ? '#f59e0b' : '#e5e7eb'}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <p>{curso.totalAvaliacoes.toLocaleString('pt-BR')} avaliações</p>
          </div>
        </div>
        <p className="det-avaliacoes-em-breve">Listagem de avaliações em breve.</p>
      </section>
    )
  }

  return (
    <div className="det-pagina">
      <Header titulo="Detalhes do Curso" />

      {/* ── Hero com fundo escuro ── */}
      <div className="det-hero">
        <div className="det-hero-inner">

          {/* Coluna esquerda */}
          <div className="det-hero-conteudo">
            <button className="det-voltar" onClick={aoVoltar} aria-label="Voltar ao catálogo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Voltar
            </button>

            <div className="det-badges">
              <span className="det-badge det-badge--cat">{curso.categoria}</span>
              <span className="det-badge det-badge--nivel">{curso.nivel}</span>
            </div>

            <h1 className="det-titulo">{curso.nome_curso}</h1>
            <p className="det-descricao">{curso.descricao}</p>

            {/* Stats */}
            <div className="det-stats">
              <span className="det-stat">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <strong>{curso.avaliacao.toFixed(1)}</strong>
                <span>({curso.totalAvaliacoes.toLocaleString('pt-BR')} avaliações)</span>
              </span>

              <span className="det-stat">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {curso.alunos.toLocaleString('pt-BR')} alunos
              </span>

              <span className="det-stat">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {curso.duracao}
              </span>

              <span className="det-stat">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                {curso.totalAulas} aulas
              </span>
            </div>

            {/* Instrutor */}
            <div className="det-hero-instrutor">
              <img src={curso.instrutor.avatar} alt={curso.instrutor.nome} />
              <div>
                <span className="det-hero-instrutor-nome">{curso.instrutor.nome}</span>
                <span className="det-hero-instrutor-cargo">Instrutor principal</span>
              </div>
            </div>
          </div>

          {/* Card lateral de compra */}
          <div className="det-card-compra">
            <img
              src={curso.thumbnail}
              alt={curso.nome_curso}
              className="det-card-thumb"
            />

            <div className="det-card-preco">
              <span className="det-card-preco-atual">R$ {curso.preco}</span>
              {curso.precoOriginal > curso.preco && (
                <>
                  <span className="det-card-preco-original">R$ {curso.precoOriginal}</span>
                  <span className="det-card-desconto">{desconto}% off</span>
                </>
              )}
            </div>

            <button className="det-btn-principal">
              {curso.progresso ? 'Continuar assistindo' : 'Comprar agora'}
            </button>

            <button className="det-btn-secundario">
              Experimentar grátis
            </button>

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

      {/* ── Abas ── */}
      <div className="det-abas-wrapper">
        <div className="det-abas">
          {[
            { id: 'visao-geral', label: 'Visão Geral'  },
            { id: 'conteudo',    label: 'Conteúdo'     },
            { id: 'avaliacoes',  label: 'Avaliações'   },
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

      {/* ── Conteúdo das abas ── */}
      <main className="det-conteudo">
        {abaAtiva === 'visao-geral' && renderVisaoGeral()}
        {abaAtiva === 'conteudo'    && renderConteudo()}
        {abaAtiva === 'avaliacoes'  && renderAvaliacoes()}
      </main>

      <div className="det-spacer-bottom" aria-hidden="true" />
      <BottomNav paginaAtual="explorar" aoNavegar={aoNavegar} />
    </div>
  )
}

export default DetalheCurso

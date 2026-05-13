import { useState, useEffect, useMemo } from 'react'
import './Catalogo.css'
import Header from '../../components/Header/Header'
import BottomNav from '../../components/BottomNav/BottomNav'
import { getCourses } from '../../services/courseService'

// ─────────────────────────────────────────────────────────────
// MOCK: usado enquanto o back-end não retorna os campos extras.
// Quando o CourseDAO/MongoDB incluir esses campos, remova o mock
// e os dados virão diretamente de getCourses().
//
// Campos que precisam ser adicionados ao schema Course.js:
//   categoria, nivel, avaliacao, totalAvaliacoes,
//   duracao, alunos, preco, precoOriginal,
//   desconto, progresso, thumbnail, instrutor { nome, avatar }
// ─────────────────────────────────────────────────────────────
const MOCK_CURSOS = [
  {
    _id: '1',
    nome_curso: 'React & TypeScript: Do Zero ao Avançado',
    categoria: 'Programação',
    nivel: 'Intermediário',
    avaliacao: 4.9,
    totalAvaliacoes: 3421,
    duracao: '42h 30min',
    alunos: 12840,
    preco: 97,
    precoOriginal: 299,
    desconto: null,
    progresso: 68,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=220&fit=crop',
    instrutor: { nome: 'Ana Lima', avatar: 'https://i.pravatar.cc/32?img=47' },
  },
  {
    _id: '2',
    nome_curso: 'UI/UX Design: Figma para Produtos Digitais',
    categoria: 'Design',
    nivel: 'Iniciante',
    avaliacao: 4.8,
    totalAvaliacoes: 2187,
    duracao: '28h 15min',
    alunos: 8903,
    preco: 79,
    precoOriginal: 199,
    desconto: null,
    progresso: 32,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=220&fit=crop',
    instrutor: { nome: 'Carlos Mendes', avatar: 'https://i.pravatar.cc/32?img=12' },
  },
  {
    _id: '3',
    nome_curso: 'Data Science com Python: Análise e Machine Learning',
    categoria: 'Data Science',
    nivel: 'Avançado',
    avaliacao: 4.7,
    totalAvaliacoes: 1893,
    duracao: '56h 00min',
    alunos: 6721,
    preco: 127,
    precoOriginal: 349,
    desconto: 64,
    progresso: null,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=220&fit=crop',
    instrutor: { nome: 'Julia Ferreira', avatar: 'https://i.pravatar.cc/32?img=32' },
  },
  {
    _id: '4',
    nome_curso: 'Marketing Digital: Do Básico ao Avançado',
    categoria: 'Marketing',
    nivel: 'Iniciante',
    avaliacao: 4.6,
    totalAvaliacoes: 4210,
    duracao: '18h 00min',
    alunos: 21300,
    preco: 59,
    precoOriginal: 179,
    desconto: 67,
    progresso: null,
    thumbnail: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&h=220&fit=crop',
    instrutor: { nome: 'Pedro Oliveira', avatar: 'https://i.pravatar.cc/32?img=53' },
  },
  {
    _id: '5',
    nome_curso: 'Node.js & APIs REST: Construção Completa',
    categoria: 'Programação',
    nivel: 'Avançado',
    avaliacao: 4.9,
    totalAvaliacoes: 2341,
    duracao: '38h 45min',
    alunos: 9150,
    preco: 107,
    precoOriginal: 259,
    desconto: null,
    progresso: null,
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=220&fit=crop',
    instrutor: { nome: 'Bruno Costa', avatar: 'https://i.pravatar.cc/32?img=8' },
  },
  {
    _id: '6',
    nome_curso: 'Fotografia Digital: Técnicas Profissionais',
    categoria: 'Fotografia',
    nivel: 'Iniciante',
    avaliacao: 4.8,
    totalAvaliacoes: 1120,
    duracao: '22h 10min',
    alunos: 5430,
    preco: 69,
    precoOriginal: 149,
    desconto: 54,
    progresso: null,
    thumbnail: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=220&fit=crop',
    instrutor: { nome: 'Camila Santos', avatar: 'https://i.pravatar.cc/32?img=25' },
  },
]

const CATEGORIAS = ['Todos', 'Programação', 'Design', 'Data Science', 'Marketing', 'Fotografia', 'Negócios', 'Idiomas']

// ── Normaliza um curso vindo do back-end, preenchendo campos
//    ausentes com defaults para não quebrar o card ──
function normalizarCurso(raw) {
  return {
    _id:             raw._id,
    nome_curso:      raw.nome_curso      ?? 'Sem título',
    categoria:       raw.categoria       ?? 'Programação',
    nivel:           raw.nivel           ?? 'Iniciante',
    avaliacao:       raw.avaliacao       ?? 0,
    totalAvaliacoes: raw.totalAvaliacoes ?? 0,
    duracao:         raw.duracao         ?? '—',
    alunos:          raw.alunos          ?? 0,
    preco:           raw.preco           ?? 0,
    precoOriginal:   raw.precoOriginal   ?? 0,
    desconto:        raw.desconto        ?? null,
    progresso:       raw.progresso       ?? null,
    thumbnail:       raw.thumbnail       ?? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=220&fit=crop',
    instrutor: {
      nome:   raw.instrutor?.nome   ?? raw.professor ?? 'Instrutor',
      avatar: raw.instrutor?.avatar ?? `https://i.pravatar.cc/32?u=${raw._id}`,
    },
  }
}

// ── Card individual de curso ──
function CardCurso({ curso, aoVerDetalhe }) {
  const corCategoria = {
    'Programação': '#7c3aed',
    'Design':      '#0ea5e9',
    'Data Science':'#10b981',
    'Marketing':   '#f59e0b',
    'Fotografia':  '#ec4899',
    'Negócios':    '#6366f1',
    'Idiomas':     '#14b8a6',
  }

  const cor = corCategoria[curso.categoria] ?? '#7c3aed'
  const temProgresso = curso.progresso !== null && curso.progresso !== undefined

  return (
    <article className="cat-card" onClick={aoVerDetalhe} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && aoVerDetalhe?.()}>
      {/* Thumbnail */}
      <div className="cat-card-thumb">
        <img src={curso.thumbnail} alt={curso.nome_curso} loading="lazy" />

        {/* Badges sobrepostos */}
        <div className="cat-card-badges">
          <span className="cat-badge cat-badge--categoria" style={{ background: cor }}>
            {curso.categoria}
          </span>
          <span className="cat-badge cat-badge--nivel">{curso.nivel}</span>
        </div>

        <div className="cat-card-rating">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>{curso.avaliacao.toFixed(1)}</span>
          <span className="cat-card-rating-total">({curso.totalAvaliacoes.toLocaleString('pt-BR')})</span>
        </div>
      </div>

      {/* Corpo do card */}
      <div className="cat-card-corpo">
        <h3 className="cat-card-titulo">{curso.nome_curso}</h3>

        {/* Instrutor */}
        <div className="cat-card-instrutor">
          <img src={curso.instrutor.avatar} alt={curso.instrutor.nome} className="cat-card-instrutor-avatar" />
          <span>{curso.instrutor.nome}</span>
        </div>

        {/* Meta: duração + alunos */}
        <div className="cat-card-meta">
          <span className="cat-card-meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {curso.duracao}
          </span>
          <span className="cat-card-meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {curso.alunos.toLocaleString('pt-BR')}
          </span>
        </div>

        {/* Rodapé: preço + badge de progresso ou desconto */}
        <div className="cat-card-rodape">
          <div className="cat-card-preco">
            <span className="cat-card-preco-atual">
              R$ {curso.preco}
            </span>
            {curso.precoOriginal > curso.preco && (
              <span className="cat-card-preco-original">
                R$ {curso.precoOriginal}
              </span>
            )}
          </div>

          {temProgresso ? (
            <span className="cat-badge-status cat-badge-status--progresso">
              {curso.progresso}% concluído
            </span>
          ) : curso.desconto ? (
            <span className="cat-badge-status cat-badge-status--desconto">
              {curso.desconto}% off
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

// ── Página principal ──
function Catalogo({ aoNavegar, aoVerDetalhe }) {
  const [cursos, setCursos]             = useState([])
  const [carregando, setCarregando]     = useState(true)
  const [erro, setErro]                 = useState('')
  const [busca, setBusca]               = useState('')
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos')

  // Busca cursos via service — nunca fetch direto na página
  useEffect(() => {
    getCourses()
      .then((data) => {
        // Se o back-end retornar dados, normaliza e usa
        // Se retornar lista vazia (MongoDB sem seed), cai no mock
        const lista = data && data.length > 0
          ? data.map(normalizarCurso)
          : MOCK_CURSOS
        setCursos(lista)
      })
      .catch(() => {
        // Em caso de erro (back-end offline), usa mock para não travar o front
        setCursos(MOCK_CURSOS)
        setErro('Modo offline — exibindo dados de demonstração.')
      })
      .finally(() => setCarregando(false))
  }, [])

  // Filtragem client-side: categoria + texto de busca
  const cursosFiltrados = useMemo(() => {
    return cursos.filter((c) => {
      const matchCategoria = categoriaAtiva === 'Todos' || c.categoria === categoriaAtiva
      const termo = busca.toLowerCase()
      const matchBusca = !termo
        || c.nome_curso.toLowerCase().includes(termo)
        || c.instrutor.nome.toLowerCase().includes(termo)
        || c.categoria.toLowerCase().includes(termo)
      return matchCategoria && matchBusca
    })
  }, [cursos, categoriaAtiva, busca])

  return (
    <div className="cat-pagina">
      <Header titulo="Catálogo" />

      <main className="cat-conteudo">

        {/* Cabeçalho da página */}
        <div className="cat-cabecalho">
          <h1 className="cat-titulo">Catálogo de Cursos</h1>
          <p className="cat-subtitulo">
            {carregando ? 'Carregando...' : `${cursosFiltrados.length} curso${cursosFiltrados.length !== 1 ? 's' : ''} disponíve${cursosFiltrados.length !== 1 ? 'is' : 'l'}`}
          </p>
        </div>

        {/* Barra de busca + filtros */}
        <div className="cat-busca-row">
          <div className="cat-busca-wrapper">
            <svg className="cat-busca-icone" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className="cat-busca-input"
              placeholder="Buscar cursos, instrutores..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar cursos"
            />
            {busca && (
              <button className="cat-busca-limpar" onClick={() => setBusca('')} aria-label="Limpar busca">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          <button className="cat-filtros-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            Filtros
          </button>
        </div>

        {/* Pills de categoria */}
        <div className="cat-categorias" role="group" aria-label="Filtrar por categoria">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${categoriaAtiva === cat ? 'cat-pill--ativa' : ''}`}
              onClick={() => setCategoriaAtiva(cat)}
              aria-pressed={categoriaAtiva === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Aviso offline */}
        {erro && (
          <div className="cat-aviso-offline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {erro}
          </div>
        )}

        {/* Grid de cursos */}
        {carregando ? (
          <div className="cat-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="cat-card-skeleton" style={{ animationDelay: `${i * 0.07}s` }} />
            ))}
          </div>
        ) : cursosFiltrados.length === 0 ? (
          <div className="cat-vazio">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p>Nenhum curso encontrado para <strong>"{busca || categoriaAtiva}"</strong>.</p>
            <button onClick={() => { setBusca(''); setCategoriaAtiva('Todos') }}>
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="cat-grid">
            {cursosFiltrados.map((curso, i) => (
              <div
                key={curso._id}
                className="cat-card-wrapper"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <CardCurso curso={curso} aoVerDetalhe={() => aoVerDetalhe && aoVerDetalhe(curso)} />
              </div>
            ))}
          </div>
        )}

      </main>

      <div className="cat-spacer-bottom" aria-hidden="true" />
      <BottomNav paginaAtual="explorar" aoNavegar={aoNavegar} />
    </div>
  )
}

export default Catalogo

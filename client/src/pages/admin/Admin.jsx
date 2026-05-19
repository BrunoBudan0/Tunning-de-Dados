import { useState, useEffect } from 'react'
import './Admin.css'
import Header from '../../components/Header/Header'
import BottomNav from '../../components/BottomNav/BottomNav'
import { getCourses, createCourse, deleteCourse } from '../../services/courseService'
import { createAula, getAulasPorCurso, deleteAula } from '../../services/aulaService'

// ─────────────────────────────────────────────────────────────
// Página de administração: criação e exclusão de cursos
// ─────────────────────────────────────────────────────────────

const AULA_VAZIA = { nome: '', descricao: '', video: '', ordem: 1 }

function Admin({ aoNavegar }) {
  // ── Lista de cursos existentes ──
  const [cursos, setCursos]         = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroLista, setErroLista]   = useState('')

  // ── Formulário de criação ──
  const [form, setForm] = useState({
    IDCurso:    '',
    nome_curso: '',
    descricao:  '',
    professor:  '',
  })
  const [aulas, setAulas]           = useState([{ ...AULA_VAZIA }])
  const [enviando, setEnviando]     = useState(false)
  const [mensagem, setMensagem]     = useState({ tipo: '', texto: '' })

  // ── Exclusão ──
  const [excluindoId, setExcluindoId] = useState(null)

  // ── Aba ativa ──
  const [aba, setAba] = useState('criar') // 'criar' | 'gerenciar'

  // ── Carrega cursos ──
  async function carregarCursos() {
    setCarregando(true)
    setErroLista('')
    try {
      const data = await getCourses()
      setCursos(data || [])
    } catch (err) {
      setErroLista(err.message || 'Erro ao carregar cursos')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregarCursos() }, [])

  // ── Handlers do form de curso ──
  function atualizarCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  // ── Handlers das aulas ──
  function atualizarAula(indice, campo, valor) {
    setAulas((lista) => lista.map((a, i) => i === indice ? { ...a, [campo]: valor } : a))
  }

  function adicionarAula() {
    setAulas((lista) => [...lista, { ...AULA_VAZIA, ordem: lista.length + 1 }])
  }

  function removerAula(indice) {
    setAulas((lista) => lista.length === 1 ? lista : lista.filter((_, i) => i !== indice))
  }

  // ── Envio do formulário ──
  async function aoEnviar(e) {
    e.preventDefault()
    setMensagem({ tipo: '', texto: '' })

    // Validação básica
    if (!form.IDCurso.trim() || !form.nome_curso.trim()) {
      setMensagem({ tipo: 'erro', texto: 'Preencha ao menos o IDCurso e o nome do curso.' })
      return
    }

    setEnviando(true)
    try {
      // 1. Cria o curso
      const cursoSalvo = await createCourse({
        IDCurso:    form.IDCurso.trim(),
        nome_curso: form.nome_curso.trim(),
        descricao:  form.descricao.trim(),
        professor:  form.professor.trim(),
      })

      // 2. Cria cada aula vinculada ao IDCurso
      const aulasValidas = aulas.filter((a) => a.nome.trim())
      for (const aula of aulasValidas) {
        await createAula({
          IDCurso:   form.IDCurso.trim(),
          nome:      aula.nome.trim(),
          descricao: aula.descricao.trim(),
          video:     aula.video.trim(),
          ordem:     Number(aula.ordem) || 1,
        })
      }

      setMensagem({
        tipo:   'sucesso',
        texto:  `Curso "${cursoSalvo.nome_curso}" criado com ${aulasValidas.length} aula(s).`,
      })

      // Reset
      setForm({ IDCurso: '', nome_curso: '', descricao: '', professor: '' })
      setAulas([{ ...AULA_VAZIA }])
      carregarCursos()
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message || 'Erro ao criar curso.' })
    } finally {
      setEnviando(false)
    }
  }

  // ── Exclusão ──
  async function aoExcluir(curso) {
    const id = curso.IDCurso ?? curso._id
    const confirmado = window.confirm(
      `Deseja realmente excluir o curso "${curso.nome_curso}"?\n\nTodas as aulas vinculadas também serão removidas.`
    )
    if (!confirmado) return

    setExcluindoId(id)
    try {
      // 1. Busca e remove aulas vinculadas (cascata manual)
      try {
        const aulasDoCurso = await getAulasPorCurso(id)
        for (const a of (aulasDoCurso || [])) {
          if (a._id) await deleteAula(a._id)
        }
      } catch { /* sem aulas — segue */ }

      // 2. Remove o curso
      await deleteCourse(id)
      setMensagem({ tipo: 'sucesso', texto: `Curso "${curso.nome_curso}" excluído.` })
      carregarCursos()
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message || 'Erro ao excluir curso.' })
    } finally {
      setExcluindoId(null)
    }
  }

  return (
    <div className="admin-pagina">
      <Header titulo="Administração" />

      <main className="admin-conteudo">

        {/* Cabeçalho */}
        <div className="admin-cabecalho">
          <h1 className="admin-titulo">Gerenciar Cursos</h1>
          <p className="admin-subtitulo">
            Crie novos cursos com suas aulas ou remova cursos existentes do catálogo.
          </p>
        </div>

        {/* Tabs */}
        <div className="admin-tabs" role="tablist">
          <button
            className={`admin-tab ${aba === 'criar' ? 'admin-tab--ativa' : ''}`}
            onClick={() => setAba('criar')}
            role="tab"
            aria-selected={aba === 'criar'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Criar curso
          </button>
          <button
            className={`admin-tab ${aba === 'gerenciar' ? 'admin-tab--ativa' : ''}`}
            onClick={() => setAba('gerenciar')}
            role="tab"
            aria-selected={aba === 'gerenciar'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            Gerenciar ({cursos.length})
          </button>
        </div>

        {/* Mensagem global */}
        {mensagem.texto && (
          <div className={`admin-alerta admin-alerta--${mensagem.tipo}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {mensagem.tipo === 'sucesso'
                ? <polyline points="20 6 9 17 4 12" />
                : (<><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>)}
            </svg>
            <span>{mensagem.texto}</span>
            <button
              className="admin-alerta-fechar"
              onClick={() => setMensagem({ tipo: '', texto: '' })}
              aria-label="Fechar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* ── Aba CRIAR ── */}
        {aba === 'criar' && (
          <form className="admin-form" onSubmit={aoEnviar}>

            {/* Bloco dados do curso */}
            <section className="admin-card">
              <header className="admin-card-cabecalho">
                <h2 className="admin-card-titulo">Dados do curso</h2>
                <p className="admin-card-sub">Informações principais que aparecerão no catálogo.</p>
              </header>

              <div className="admin-grid-2">
                <div className="admin-campo">
                  <label className="admin-label" htmlFor="IDCurso">
                    IDCurso <span className="admin-required">*</span>
                  </label>
                  <input
                    id="IDCurso"
                    className="admin-input"
                    type="text"
                    placeholder="ex: curso_3"
                    value={form.IDCurso}
                    onChange={(e) => atualizarCampo('IDCurso', e.target.value)}
                    required
                  />
                  <span className="admin-hint">Identificador único usado no sistema.</span>
                </div>

                <div className="admin-campo">
                  <label className="admin-label" htmlFor="professor">Professor</label>
                  <input
                    id="professor"
                    className="admin-input"
                    type="text"
                    placeholder="Nome do instrutor"
                    value={form.professor}
                    onChange={(e) => atualizarCampo('professor', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-campo">
                <label className="admin-label" htmlFor="nome_curso">
                  Nome do curso <span className="admin-required">*</span>
                </label>
                <input
                  id="nome_curso"
                  className="admin-input"
                  type="text"
                  placeholder="ex: React Avançado: Hooks e Performance"
                  value={form.nome_curso}
                  onChange={(e) => atualizarCampo('nome_curso', e.target.value)}
                  required
                />
              </div>

              <div className="admin-campo">
                <label className="admin-label" htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  className="admin-input admin-textarea"
                  placeholder="Descreva o que o aluno aprenderá neste curso..."
                  rows={4}
                  value={form.descricao}
                  onChange={(e) => atualizarCampo('descricao', e.target.value)}
                />
              </div>
            </section>

            {/* Bloco aulas */}
            <section className="admin-card">
              <header className="admin-card-cabecalho">
                <div>
                  <h2 className="admin-card-titulo">Aulas</h2>
                  <p className="admin-card-sub">Adicione as aulas que compõem este curso.</p>
                </div>
                <button
                  type="button"
                  className="admin-btn-secundario"
                  onClick={adicionarAula}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Adicionar aula
                </button>
              </header>

              <div className="admin-aulas-lista">
                {aulas.map((aula, i) => (
                  <div key={i} className="admin-aula-item">
                    <div className="admin-aula-cabecalho">
                      <span className="admin-aula-numero">Aula {i + 1}</span>
                      {aulas.length > 1 && (
                        <button
                          type="button"
                          className="admin-aula-remover"
                          onClick={() => removerAula(i)}
                          aria-label="Remover aula"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                          </svg>
                          Remover
                        </button>
                      )}
                    </div>

                    <div className="admin-grid-2">
                      <div className="admin-campo">
                        <label className="admin-label">Nome da aula</label>
                        <input
                          className="admin-input"
                          type="text"
                          placeholder="ex: Introdução ao React"
                          value={aula.nome}
                          onChange={(e) => atualizarAula(i, 'nome', e.target.value)}
                        />
                      </div>
                      <div className="admin-campo">
                        <label className="admin-label">Ordem</label>
                        <input
                          className="admin-input"
                          type="number"
                          min="1"
                          value={aula.ordem}
                          onChange={(e) => atualizarAula(i, 'ordem', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="admin-campo">
                      <label className="admin-label">URL do vídeo</label>
                      <input
                        className="admin-input"
                        type="url"
                        placeholder="https://..."
                        value={aula.video}
                        onChange={(e) => atualizarAula(i, 'video', e.target.value)}
                      />
                    </div>

                    <div className="admin-campo">
                      <label className="admin-label">Descrição</label>
                      <textarea
                        className="admin-input admin-textarea"
                        rows={2}
                        placeholder="O que será visto nesta aula..."
                        value={aula.descricao}
                        onChange={(e) => atualizarAula(i, 'descricao', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="admin-acoes">
              <button
                type="button"
                className="admin-btn-secundario"
                onClick={() => {
                  setForm({ IDCurso: '', nome_curso: '', descricao: '', professor: '' })
                  setAulas([{ ...AULA_VAZIA }])
                  setMensagem({ tipo: '', texto: '' })
                }}
                disabled={enviando}
              >
                Limpar
              </button>
              <button
                type="submit"
                className="admin-btn-primario"
                disabled={enviando}
              >
                {enviando ? 'Salvando...' : 'Criar curso'}
                {!enviando && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ── Aba GERENCIAR ── */}
        {aba === 'gerenciar' && (
          <section className="admin-card">
            <header className="admin-card-cabecalho">
              <div>
                <h2 className="admin-card-titulo">Cursos existentes</h2>
                <p className="admin-card-sub">Remova cursos do catálogo. Aulas vinculadas também serão excluídas.</p>
              </div>
              <button
                type="button"
                className="admin-btn-secundario"
                onClick={carregarCursos}
                disabled={carregando}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                Recarregar
              </button>
            </header>

            {erroLista && (
              <div className="admin-alerta admin-alerta--erro" style={{ marginBottom: 16 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{erroLista}</span>
              </div>
            )}

            {carregando ? (
              <div className="admin-lista-vazia">Carregando cursos...</div>
            ) : cursos.length === 0 ? (
              <div className="admin-lista-vazia">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <p>Nenhum curso cadastrado ainda.</p>
                <button className="admin-btn-primario" onClick={() => setAba('criar')}>
                  Criar primeiro curso
                </button>
              </div>
            ) : (
              <ul className="admin-cursos-lista">
                {cursos.map((curso) => {
                  const id = curso.IDCurso ?? curso._id
                  const excluindo = excluindoId === id
                  return (
                    <li key={id} className="admin-curso-item">
                      <div className="admin-curso-info">
                        <span className="admin-curso-id">{curso.IDCurso ?? '—'}</span>
                        <h3 className="admin-curso-nome">{curso.nome_curso}</h3>
                        {curso.professor && (
                          <span className="admin-curso-prof">por {curso.professor}</span>
                        )}
                        {curso.descricao && (
                          <p className="admin-curso-desc">{curso.descricao}</p>
                        )}
                      </div>
                      <button
                        className="admin-btn-perigo"
                        onClick={() => aoExcluir(curso)}
                        disabled={excluindo}
                      >
                        {excluindo ? 'Excluindo...' : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6" /><path d="M14 11v6" />
                            </svg>
                            Excluir
                          </>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )}

      </main>

      <div className="admin-spacer-bottom" aria-hidden="true" />
      <BottomNav paginaAtual="admin" aoNavegar={aoNavegar} />
    </div>
  )
}

export default Admin

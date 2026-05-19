import { useState, useEffect } from 'react'
import './Perfil.css'
import Header from '../../components/Header/Header'
import BottomNav from '../../components/BottomNav/BottomNav'
import { getUserById } from '../../services/userService'
import { getCourses } from '../../services/courseService'
import { getMatriculas, getProgresso } from '../../services/progressoService'

function Perfil({ idUsuario = 1, aoNavegar }) {
  const [abaAtiva, setAbaAtiva] = useState('dados')
  const [usuario, setUsuario] = useState(null)
  const [cursosUsuario, setCursosUsuario] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [form, setForm] = useState({
    nome: '',
    email: '',
    localizacao: '',
    dataNascimento: '',
  })

  // ── Busca dados do usuário, matrículas e progresso real ──
  useEffect(() => {
    async function carregar() {
      try {
        const [dadosUsuario, matriculas, todosCursos] = await Promise.all([
          getUserById(idUsuario),
          getMatriculas(idUsuario),
          getCourses(),
        ])

        setUsuario(dadosUsuario)
        setForm({
          nome:           dadosUsuario.nome          ?? '',
          email:          dadosUsuario.email         ?? '',
          localizacao:    dadosUsuario.localizacao   ?? 'São Paulo, SP',
          dataNascimento: dadosUsuario.dataNascimento ?? '',
        })

        // Junta matrícula + curso + progresso
        const cursosComProgresso = await Promise.all(
          matriculas.map(async (m) => {
            const curso = todosCursos.find(
              (c) => String(c.IDCurso) === String(m.id_curso) ||
                     String(c._id)     === String(m.id_curso)
            )
            let progresso = 0
            try {
              const p = await getProgresso(idUsuario, m.id_curso)
              progresso = p?.progresso ?? 0
            } catch {
              progresso = 0
            }
            return {
              id_curso: m.id_curso,
              status:   m.status,
              titulo:   curso?.nome_curso ?? 'Curso',
              professor: curso?.professor ?? '',
              progresso,
            }
          })
        )

        setCursosUsuario(cursosComProgresso)
      } catch (err) {
        setErro(err.message)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [idUsuario])

  function handleFormChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Stats reais
  const totalCursos     = cursosUsuario.length
  const totalConcluidos = cursosUsuario.filter((c) => c.status === 'concluido').length
  const mediaProgresso  = totalCursos === 0
    ? 0
    : Math.round(cursosUsuario.reduce((acc, c) => acc + c.progresso, 0) / totalCursos)

  // ── Conteúdo da aba Dados ──
  function renderDados() {
    return (
      <>
        <section className="perfil-secao">
          <h2 className="perfil-secao-titulo">Informações pessoais</h2>

          <div className="perfil-form-grid">
            <div className="perfil-campo">
              <label htmlFor="nome">Nome completo</label>
              <input id="nome" name="nome" type="text" value={form.nome} onChange={handleFormChange} />
            </div>
            <div className="perfil-campo">
              <label htmlFor="email">E-mail</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleFormChange} />
            </div>
            <div className="perfil-campo">
              <label htmlFor="localizacao">Localização</label>
              <input id="localizacao" name="localizacao" type="text" value={form.localizacao} onChange={handleFormChange} />
            </div>
            <div className="perfil-campo">
              <label htmlFor="dataNascimento">Data de nascimento</label>
              <input
                id="dataNascimento"
                name="dataNascimento"
                type="text"
                placeholder="dd/mm/aaaa"
                value={form.dataNascimento}
                onChange={handleFormChange}
              />
            </div>
          </div>
        </section>

        <section className="perfil-secao">
          <h2 className="perfil-secao-titulo">
            Meus cursos
            {cursosUsuario.length > 0 && (
              <span style={{
                marginLeft: 8,
                fontSize: 13,
                color: '#6b7280',
                fontWeight: 400,
              }}>
                ({cursosUsuario.length})
              </span>
            )}
          </h2>

          {cursosUsuario.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: 14 }}>
              Você ainda não está matriculado em nenhum curso. Explore o catálogo!
            </p>
          ) : (
            <div className="perfil-cursos-lista">
              {cursosUsuario.map((curso) => (
                <div key={curso.id_curso} className="perfil-curso-item">
                  <div
                    className="perfil-curso-thumb"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 22,
                    }}
                  >
                    {curso.titulo.charAt(0).toUpperCase()}
                  </div>

                  <div className="perfil-curso-info">
                    <span className="perfil-curso-titulo">{curso.titulo}</span>
                    {curso.professor && (
                      <span style={{ fontSize: 12, color: '#6b7280' }}>
                        Prof. {curso.professor}
                      </span>
                    )}

                    <div className="perfil-curso-progresso">
                      <div className="perfil-progresso-barra">
                        <div
                          className="perfil-progresso-fill"
                          style={{ width: `${curso.progresso}%` }}
                          aria-valuenow={curso.progresso}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          role="progressbar"
                        />
                      </div>
                      <span className="perfil-progresso-pct">{curso.progresso}%</span>
                    </div>

                    <span style={{
                      fontSize: 11,
                      color: curso.status === 'concluido' ? '#16a34a' : '#6b7280',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                    }}>
                      {curso.status === 'concluido' ? '✓ Concluído' : curso.status?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </>
    )
  }

  function renderHistorico() {
    return (
      <section className="perfil-secao perfil-vazio">
        <div className="perfil-vazio-icone">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <p>Seu histórico de atividades aparecerá aqui.</p>
      </section>
    )
  }

  function renderConfiguracoes() {
    return (
      <section className="perfil-secao perfil-vazio">
        <div className="perfil-vazio-icone">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>
        <p>Configurações de conta em breve.</p>
      </section>
    )
  }

  if (carregando) {
    return (
      <div className="perfil-pagina">
        <Header titulo="Perfil" />
        <div className="perfil-carregando">
          <div className="perfil-spinner" />
          <span>Carregando perfil...</span>
        </div>
        <BottomNav paginaAtual="perfil" aoNavegar={aoNavegar} />
      </div>
    )
  }

  if (erro) {
    return (
      <div className="perfil-pagina">
        <Header titulo="Perfil" />
        <div className="perfil-erro">
          <p>Não foi possível carregar o perfil.</p>
          <span>{erro}</span>
        </div>
        <BottomNav paginaAtual="perfil" aoNavegar={aoNavegar} />
      </div>
    )
  }

  // Extrai até 2 iniciais do nome completo
  function getIniciais(nome = '') {
    const partes = nome.trim().split(/\s+/).filter(Boolean)
    if (partes.length === 0) return '?'
    if (partes.length === 1) return partes[0][0].toUpperCase()
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
  }

  return (
    <div className="perfil-pagina">
      <Header titulo="Perfil" />

      <main className="perfil-conteudo">

        <div className="perfil-card-topo">
          <div className="perfil-capa" aria-hidden="true" />

          <div className="perfil-card-corpo">
            <div className="perfil-avatar-wrapper">
              <div className="perfil-avatar-iniciais" aria-label={`Avatar de ${usuario?.nome}`}>
                {getIniciais(usuario?.nome ?? '')}
              </div>
            </div>

            <button className="perfil-btn-editar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Editar perfil
            </button>
          </div>

          <div className="perfil-info">
            <h1 className="perfil-nome">{usuario?.nome ?? 'Usuário'}</h1>
            <p className="perfil-bio">Aluno da plataforma E-Cursos.</p>

            <div className="perfil-meta">
              <span className="perfil-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {usuario?.email}
              </span>

              {usuario?.telefone && (
                <span className="perfil-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {usuario.telefone}
                </span>
              )}
            </div>
          </div>

          {/* Stats reais a partir do Cassandra */}
          <div className="perfil-stats">
            <div className="perfil-stat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <strong>{totalCursos}</strong>
              <span>{totalCursos === 1 ? 'Curso' : 'Cursos'}</span>
            </div>

            <div className="perfil-stat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
              </svg>
              <strong>{totalConcluidos}</strong>
              <span>Concluídos</span>
            </div>

            <div className="perfil-stat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <strong>{mediaProgresso}%</strong>
              <span>Progresso médio</span>
            </div>
          </div>
        </div>

        <div className="perfil-abas">
          {['dados', 'historico', 'configuracoes'].map((aba) => {
            const labels = { dados: 'Dados', historico: 'Histórico', configuracoes: 'Configurações' }
            return (
              <button
                key={aba}
                className={`perfil-aba ${abaAtiva === aba ? 'perfil-aba--ativa' : ''}`}
                onClick={() => setAbaAtiva(aba)}
              >
                {labels[aba]}
              </button>
            )
          })}
        </div>

        <div className="perfil-aba-conteudo">
          {abaAtiva === 'dados'          && renderDados()}
          {abaAtiva === 'historico'      && renderHistorico()}
          {abaAtiva === 'configuracoes'  && renderConfiguracoes()}
        </div>

      </main>

      <div className="perfil-spacer-bottom" aria-hidden="true" />

      <BottomNav paginaAtual="perfil" aoNavegar={aoNavegar} />
    </div>
  )
}

export default Perfil

import { useState, useEffect } from 'react'
import './Perfil.css'
import Header from '../../components/Header/Header'
import BottomNav from '../../components/BottomNav/BottomNav'
import { getUserById } from '../../services/userService'
import { getProgresso } from '../../services/progressoService'

// Mock de cursos em andamento enquanto o back-end de cursos não está integrado
const CURSOS_MOCK = [
  {
    id: '1',
    titulo: 'React & TypeScript: Do Zero ao Avançado',
    progresso: 68,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=80&h=80&fit=crop',
  },
  {
    id: '2',
    titulo: 'UI/UX Design: Figma para Produtos Digitais',
    progresso: 32,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=80&h=80&fit=crop',
  },
]

function Perfil({ idUsuario = 1, aoNavegar }) {
  const [abaAtiva, setAbaAtiva] = useState('dados')
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  // Campos do formulário de edição
  const [form, setForm] = useState({
    nome: '',
    email: '',
    localizacao: '',
    dataNascimento: '',
  })

  // ── Busca dados do usuário via service (nunca fetch direto) ──
  useEffect(() => {
    getUserById(idUsuario)
      .then((data) => {
        setUsuario(data)
        setForm({
          nome:           data.nome          ?? '',
          email:          data.email         ?? '',
          localizacao:    data.localizacao   ?? 'São Paulo, SP',
          dataNascimento: data.dataNascimento ?? '',
        })
      })
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false))
  }, [idUsuario])

  function handleFormChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // ── Conteúdo da aba Dados ──
  function renderDados() {
    return (
      <>
        {/* Informações pessoais */}
        <section className="perfil-secao">
          <h2 className="perfil-secao-titulo">Informações pessoais</h2>

          <div className="perfil-form-grid">
            <div className="perfil-campo">
              <label htmlFor="nome">Nome completo</label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={form.nome}
                onChange={handleFormChange}
              />
            </div>

            <div className="perfil-campo">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleFormChange}
              />
            </div>

            <div className="perfil-campo">
              <label htmlFor="localizacao">Localização</label>
              <input
                id="localizacao"
                name="localizacao"
                type="text"
                value={form.localizacao}
                onChange={handleFormChange}
              />
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

        {/* Cursos em andamento */}
        <section className="perfil-secao">
          <h2 className="perfil-secao-titulo">Cursos em andamento</h2>

          <div className="perfil-cursos-lista">
            {CURSOS_MOCK.map((curso) => (
              <div key={curso.id} className="perfil-curso-item">
                <img
                  src={curso.thumbnail}
                  alt={curso.titulo}
                  className="perfil-curso-thumb"
                />

                <div className="perfil-curso-info">
                  <span className="perfil-curso-titulo">{curso.titulo}</span>

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
                </div>

                <button className="perfil-curso-seta" aria-label="Ver curso">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      </>
    )
  }

  // ── Conteúdo da aba Histórico (placeholder) ──
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

  // ── Conteúdo da aba Configurações (placeholder) ──
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

  // ── Estados de loading / erro ──
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

  // ── Render principal ──
  return (
    <div className="perfil-pagina">
      <Header titulo="Perfil" />

      <main className="perfil-conteudo">

        {/* ── Card de capa + avatar ── */}
        <div className="perfil-card-topo">
          <div className="perfil-capa" aria-hidden="true" />

          <div className="perfil-card-corpo">
            <div className="perfil-avatar-wrapper">
              <img
                src="https://i.pravatar.cc/100?img=11"
                alt={`Avatar de ${usuario?.nome}`}
                className="perfil-avatar-img"
              />
              <button className="perfil-avatar-camera" aria-label="Alterar foto de perfil">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
            </div>

            <button className="perfil-btn-editar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Editar perfil
            </button>
          </div>

          {/* Info do usuário */}
          <div className="perfil-info">
            <h1 className="perfil-nome">{usuario?.nome ?? 'Usuário'}</h1>
            <p className="perfil-bio">Desenvolvedor apaixonado por tecnologia e aprendizado contínuo.</p>

            <div className="perfil-meta">
              <span className="perfil-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {usuario?.email}
              </span>

              <span className="perfil-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                São Paulo, SP
              </span>

              <span className="perfil-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Membro desde Janeiro 2024
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="perfil-stats">
            <div className="perfil-stat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <strong>142</strong>
              <span>Horas</span>
            </div>

            <div className="perfil-stat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <strong>3</strong>
              <span>Cursos</span>
            </div>

            <div className="perfil-stat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
              </svg>
              <strong>3</strong>
              <span>Certificados</span>
            </div>
          </div>
        </div>

        {/* ── Abas ── */}
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

        {/* ── Conteúdo das abas ── */}
        <div className="perfil-aba-conteudo">
          {abaAtiva === 'dados'          && renderDados()}
          {abaAtiva === 'historico'      && renderHistorico()}
          {abaAtiva === 'configuracoes'  && renderConfiguracoes()}
        </div>

      </main>

      {/* Espaço para não ficar atrás do BottomNav */}
      <div className="perfil-spacer-bottom" aria-hidden="true" />

      <BottomNav paginaAtual="perfil" aoNavegar={aoNavegar} />
    </div>
  )
}

export default Perfil

import './Header.css'

function Header({ titulo, paginaAtual }) {
  return (
    <header className="header">
      <div className="header-esquerda">
        <div className="header-logo">
          <span>E</span>
        </div>
        <span className="header-marca">EduFlow</span>

        {titulo && (
          <>
            <span className="header-separador">/</span>
            <span className="header-titulo">{titulo}</span>
          </>
        )}
      </div>

      <div className="header-direita">
        <button className="header-icone-btn" aria-label="Pesquisar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        <button className="header-icone-btn header-notif-btn" aria-label="Notificações">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="header-notif-dot" aria-hidden="true" />
        </button>

        <button className="header-avatar-btn" aria-label="Meu perfil">
          <div className="header-avatar">
            <img
              src="https://i.pravatar.cc/40?img=11"
              alt="Avatar do usuário"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
        </button>
      </div>
    </header>
  )
}

export default Header

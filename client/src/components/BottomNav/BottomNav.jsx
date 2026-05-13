import './BottomNav.css'

// Ícones SVG inline — sem dependência de biblioteca externa
const icones = {
  home: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9 21 9 12 15 12 15 21" />
    </svg>
  ),
  explorar: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  dashboard: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  cursos: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  perfil: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
}

const itens = [
  { id: 'home',      label: 'Home',      icone: 'home'      },
  { id: 'explorar',  label: 'Explorar',  icone: 'explorar'  },
  { id: 'dashboard', label: 'Dashboard', icone: 'dashboard' },
  { id: 'cursos',    label: 'Cursos',    icone: 'cursos'    },
  { id: 'perfil',    label: 'Perfil',    icone: 'perfil'    },
]

function BottomNav({ paginaAtual, aoNavegar }) {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      <div className="bottom-nav-pill">
        {itens.map((item) => {
          const ativo = paginaAtual === item.id

          return (
            <button
              key={item.id}
              className={`bottom-nav-item ${ativo ? 'bottom-nav-item--ativo' : ''}`}
              onClick={() => aoNavegar && aoNavegar(item.id)}
              aria-label={item.label}
              aria-current={ativo ? 'page' : undefined}
            >
              <span className="bottom-nav-icone">
                {icones[item.icone]}
              </span>

              {ativo && (
                <span className="bottom-nav-label">{item.label}</span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav

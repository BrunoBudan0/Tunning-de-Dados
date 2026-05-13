import './Home.css'
import BottomNav from '../../components/BottomNav/BottomNav'

// Avatares de prova social
const AVATARES = [
  'https://i.pravatar.cc/32?img=1',
  'https://i.pravatar.cc/32?img=5',
  'https://i.pravatar.cc/32?img=9',
]

function Home({ usuario, aoNavegar }) {
  return (
    <div className="home-pagina">

      {/* ── Hero ── */}
      <main className="home-hero">

        {/* Coluna esquerda */}
        <div className="home-hero-esquerda">

          <span className="home-badge">
            <span className="home-badge-dot" aria-hidden="true" />
            Plataforma #1 em educação tech no Brasil
          </span>

          <h1 className="home-titulo">
            Aprenda. Evolua.<br />
            <span className="home-titulo-destaque">Transforme</span> sua carreira.
          </h1>

          <p className="home-subtitulo">
            Cursos online criados por especialistas do mercado.
            Aprenda no seu ritmo, obtenha certificação e acelere
            sua carreira em tech.
          </p>

          <div className="home-acoes">
            <button
              className="home-btn-primario"
              onClick={() => aoNavegar && aoNavegar('cadastro')}
            >
              Comece gratuitamente
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            <button className="home-btn-secundario">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Ver cursos
            </button>
          </div>

          {/* Prova social */}
          <div className="home-prova-social">
            <div className="home-avatares">
              {AVATARES.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Aluno satisfeito"
                  className="home-avatar"
                  style={{ zIndex: AVATARES.length - i }}
                />
              ))}
            </div>

            <div className="home-rating">
              <div className="home-estrelas" aria-label="Avaliação 4.9 de 5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="home-rating-num">4.9</span>
              <span className="home-rating-texto">+50.000 alunos satisfeitos</span>
            </div>
          </div>
        </div>

        {/* Coluna direita — imagem + cards flutuantes */}
        <div className="home-hero-direita">
          <div className="home-imagem-wrapper">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop"
              alt="Alunos aprendendo tecnologia"
              className="home-imagem"
            />

            {/* Card topo: Certificado */}
            <div className="home-card-flutuante home-card-certificado">
              <span className="home-card-icone home-card-icone--verde">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Certificado reconhecido</span>
            </div>

            {/* Card baixo: Empregabilidade */}
            <div className="home-card-flutuante home-card-empregabilidade">
              <div className="home-card-icone home-card-icone--roxo">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <div>
                <strong>+85% empregabilidade</strong>
                <span>após conclusão do curso</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      <div className="home-spacer-bottom" aria-hidden="true" />

      <BottomNav paginaAtual="home" aoNavegar={aoNavegar} />
    </div>
  )
}

export default Home

import { useState } from 'react'
import Login from './pages/login/Login'
import Cadastro from './pages/cadastro/Cadastro'
import RecuperarSenha from './pages/recuperarSenha/RecuperarSenha'
import Home from './pages/home/Home'
import Perfil from './pages/perfil/Perfil'
import Catalogo from './pages/catalogo/Catalogo'
import DetalheCurso from './pages/detalhe-curso/DetalheCurso'

function App() {
  const [paginaAtual, setPaginaAtual]         = useState('login')
  const [usuarioLogado, setUsuarioLogado]     = useState(null)
  const [cursoSelecionado, setCursoSelecionado] = useState(null)

  // ── Autenticação ──
  function aoLogin(data) {
    setUsuarioLogado(data)
    setPaginaAtual('home')
  }

  // ── Navegar para detalhe de um curso ──
  function aoVerDetalhe(curso) {
    setCursoSelecionado(curso)
    setPaginaAtual('detalhe-curso')
  }

  // ── Navegação interna (BottomNav e demais páginas) ──
  function aoNavegar(pagina) {
    const mapa = {
      home:      'home',
      explorar:  'catalogo',
      dashboard: 'home',      // placeholder
      cursos:    'home',      // placeholder
      perfil:    'perfil',
      cadastro:  'cadastro',
    }
    setPaginaAtual(mapa[pagina] ?? pagina)
  }

  // ── Rotas ──
  if (paginaAtual === 'cadastro') {
    return <Cadastro irParaLogin={() => setPaginaAtual('login')} />
  }

  if (paginaAtual === 'recuperar-senha') {
    return <RecuperarSenha irParaLogin={() => setPaginaAtual('login')} />
  }

  if (paginaAtual === 'home') {
    return <Home usuario={usuarioLogado} aoNavegar={aoNavegar} />
  }

  if (paginaAtual === 'catalogo') {
    return (
      <Catalogo
        aoNavegar={aoNavegar}
        aoVerDetalhe={aoVerDetalhe}
      />
    )
  }

  if (paginaAtual === 'detalhe-curso') {
    return (
      <DetalheCurso
        cursoInicial={cursoSelecionado}
        aoNavegar={aoNavegar}
        aoVoltar={() => setPaginaAtual('catalogo')}
      />
    )
  }

  if (paginaAtual === 'perfil') {
    return (
      <Perfil
        usuario={usuarioLogado}
        idUsuario={usuarioLogado?.id ?? 1}
        aoNavegar={aoNavegar}
      />
    )
  }

  // Padrão: tela de login
  return (
    <Login
      aoLogin={aoLogin}
      irParaCadastro={() => setPaginaAtual('cadastro')}
      irParaRecuperarSenha={() => setPaginaAtual('recuperar-senha')}
    />
  )
}

export default App

import { useState } from 'react'
import Login from './pages/login/Login'
import Cadastro from './pages/cadastro/Cadastro'
import RecuperarSenha from './pages/recuperarSenha/RecuperarSenha'
import Cursos from './pages/cursos/Cursos'
import CursoDetalhe from './pages/cursoDetalhe/CursoDetalhe'

function App() {
  const [paginaAtual, setPaginaAtual] = useState('login')
  const [usuario, setUsuario] = useState(null)
  const [cursoSelecionado, setCursoSelecionado] = useState(null)

  function irParaCadastro() {
    setPaginaAtual('cadastro')
  }

  function irParaLogin() {
    setPaginaAtual('login')
  }

  function irParaRecuperarSenha() {
    setPaginaAtual('recuperar-senha')
  }

  function handleLogin(usuarioLogado) {
    setUsuario(usuarioLogado)
    setPaginaAtual('cursos')
  }

  function sair() {
    setUsuario(null)
    setCursoSelecionado(null)
    setPaginaAtual('login')
  }

  function irParaDetalhe(idCurso) {
    setCursoSelecionado(idCurso)
    setPaginaAtual('curso-detalhe')
  }

  function voltarParaCursos() {
    setCursoSelecionado(null)
    setPaginaAtual('cursos')
  }

  if (paginaAtual === 'cadastro') {
    return <Cadastro irParaLogin={irParaLogin} />
  }

  if (paginaAtual === 'recuperar-senha') {
    return <RecuperarSenha irParaLogin={irParaLogin} />
  }

  if (paginaAtual === 'cursos' && usuario) {
    return (
      <Cursos
        usuario={usuario}
        irParaDetalhe={irParaDetalhe}
        sair={sair}
      />
    )
  }

  if (paginaAtual === 'curso-detalhe' && usuario && cursoSelecionado) {
    return (
      <CursoDetalhe
        usuario={usuario}
        idCurso={cursoSelecionado}
        voltar={voltarParaCursos}
      />
    )
  }

  return (
    <Login
      irParaCadastro={irParaCadastro}
      irParaRecuperarSenha={irParaRecuperarSenha}
      onLogin={handleLogin}
    />
  )
}

export default App

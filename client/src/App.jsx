import { useState } from 'react'
import Login from './pages/login/Login'
import Cadastro from './pages/cadastro/Cadastro'
import RecuperarSenha from './pages/recuperarSenha/RecuperarSenha'

function App() {
  const [paginaAtual, setPaginaAtual] = useState('login')

  function irParaCadastro() {
    setPaginaAtual('cadastro')
  }

  function irParaLogin() {
    setPaginaAtual('login')
  }

  function irParaRecuperarSenha() {
    setPaginaAtual('recuperar-senha')
  }

  if (paginaAtual === 'cadastro') {
    return <Cadastro irParaLogin={irParaLogin} />
  }

  if (paginaAtual === 'recuperar-senha') {
    return <RecuperarSenha irParaLogin={irParaLogin} />
  }

  return (
    <Login
      irParaCadastro={irParaCadastro}
      irParaRecuperarSenha={irParaRecuperarSenha}
    />
  )
}

export default App
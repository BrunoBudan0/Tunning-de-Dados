import { useState } from 'react'
import Login from './pages/login/Login'
import Cadastro from './pages/cadastro/Cadastro'

function App() {
  const [paginaAtual, setPaginaAtual] = useState('login')

  function irParaCadastro() {
    setPaginaAtual('cadastro')
  }

  function irParaLogin() {
    setPaginaAtual('login')
  }

  if (paginaAtual === 'cadastro') {
    return <Cadastro irParaLogin={irParaLogin} />
  }

  return <Login irParaCadastro={irParaCadastro} />
}

export default App
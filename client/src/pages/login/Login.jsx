import { useState } from 'react'
import './Login.css'
import { supabase } from '../../lib/supabase'

function Login({ irParaCadastro, irParaRecuperarSenha, aoLogin }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regexEmail.test(email)
  }

  async function handleLogin(event) {
    event.preventDefault()
    setErro('')

    const emailDigitado = email.trim().toLowerCase()
    const senhaDigitada = senha.trim()

    if (!emailDigitado || !senhaDigitada) {
      setErro('Preencha email e senha para continuar.')
      return
    }

    if (!validarEmail(emailDigitado)) {
      setErro('Digite um email válido.')
      return
    }

    setCarregando(true)

    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome, telefone, email, senha')
      .eq('email', emailDigitado)
      .eq('senha', senhaDigitada)
      .maybeSingle()

    setCarregando(false)

    if (error) {
      console.log('Erro Supabase:', error)

      if (error.message?.includes('JWT expired')) {
        setErro('Sessão expirada. Atualize a chave do Supabase e tente novamente.')
        return
      }
      if (error.message?.includes('row-level security')) {
        setErro('Acesso bloqueado pela segurança do Supabase. Verifique as policies.')
        return
      }

      setErro('Não foi possível consultar o banco agora. Tente novamente.')
      return
    }

    if (!data) {
      setErro('Email ou senha inválidos.')
      return
    }

    // Repassa o usuário autenticado para o App.jsx — sem alert
    aoLogin(data)
  }

  return (
    <div className="login-page">
      <main className="login-main">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span>C</span>
            </div>
            <span className="login-brand">Cursos</span>
          </div>

          <div className="login-title">
            <h1>Entrar na plataforma</h1>
            <p>
              Não tem uma conta?{' '}
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  irParaCadastro()
                }}
              >
                Cadastre-se
              </a>
            </p>
          </div>

          <form className="login-form" onSubmit={handleLogin} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setErro('')
                }}
                className={erro ? 'input-error' : ''}
                required
              />
            </div>

            <div className="form-group">
              <div className="password-top">
                <label htmlFor="password">Senha</label>
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                    irParaRecuperarSenha()
                  }}
                >
                  Esqueceu a senha?
                </a>
              </div>

              <div className="password-wrapper">
                <input
                  id="password"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={senha}
                  onChange={(event) => {
                    setSenha(event.target.value)
                    setErro('')
                  }}
                  className={erro ? 'input-error' : ''}
                  required
                />
                <button
                  type="button"
                  aria-label="Mostrar senha"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  <span className="material-symbol">
                    {mostrarSenha ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {erro && (
              <div className="login-error">
                <span className="login-error-icon">!</span>
                <span>{erro}</span>
              </div>
            )}

            <button className="login-button" type="submit" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </main>

      <footer className="login-footer">
        <div>© 2024 E-Cursos. Lifelong learning for everyone.</div>
        <nav>
          <a href="#">Termos</a>
          <a href="#">Privacidade</a>
          <a href="#">Suporte</a>
        </nav>
      </footer>
    </div>
  )
}

export default Login

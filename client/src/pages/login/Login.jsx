import { useState } from 'react'
import './Login.css'
import { supabase } from '../../lib/supabase'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  async function handleLogin(event) {
    event.preventDefault()

    setErro('')
    setCarregando(true)

    const emailDigitado = email.trim()
    const senhaDigitada = senha.trim()

    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome, telefone, email, senha')
      .eq('email', emailDigitado)
      .eq('senha', senhaDigitada)
      .maybeSingle()

    setCarregando(false)

    if (error) {
      setErro('Erro ao consultar o banco.')
      return
    }

    if (!data) {
      setErro('Email ou senha inválidos.')
      return
    }

    alert(`Bem-vinda, ${data.nome}!`)
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
              <a href="#">
                Cadastre-se
              </a>
            </p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="password-top">
                <label htmlFor="password">Senha</label>

                <a href="#">
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
                  onChange={(event) => setSenha(event.target.value)}
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

            {erro && <p className="login-error">{erro}</p>}

            <button className="login-button" type="submit" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </main>

      <footer className="login-footer">
        <div>
          © 2024 E-Cursos. Lifelong learning for everyone.
        </div>

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
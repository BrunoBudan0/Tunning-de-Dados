import { useState } from 'react'
import './RecuperarSenha.css'
import { supabase } from '../../lib/supabase'

function RecuperarSenha({ irParaLogin }) {
  const [email, setEmail] = useState('')
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null)
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regexEmail.test(email)
  }

  function validarSenha(senha) {
    if (senha.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres.'
    }

    if (!/[a-z]/.test(senha)) {
      return 'A senha deve conter pelo menos uma letra minúscula.'
    }

    if (!/[A-Z]/.test(senha)) {
      return 'A senha deve conter pelo menos uma letra maiúscula.'
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(senha)) {
      return 'A senha deve conter pelo menos um caractere especial.'
    }

    return ''
  }

  async function handleBuscarEmail(event) {
    event.preventDefault()

    setErro('')
    setSucesso('')
    setUsuarioEncontrado(null)
    setNovaSenha('')
    setConfirmarSenha('')

    const emailDigitado = email.trim().toLowerCase()

    if (!emailDigitado) {
      setErro('Informe seu email para continuar.')
      return
    }

    if (!validarEmail(emailDigitado)) {
      setErro('Digite um email válido.')
      return
    }

    setCarregando(true)

    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome, email')
      .eq('email', emailDigitado)
      .maybeSingle()

    setCarregando(false)

    if (error) {
      console.log('Erro Supabase:', error)
      setErro('Não foi possível consultar o banco agora.')
      return
    }

    if (!data) {
      setErro('Nenhuma conta foi encontrada com este email.')
      return
    }

    setUsuarioEncontrado(data)
    setSucesso(`Conta encontrada para ${data.nome}. Digite sua nova senha.`)
  }

  async function handleTrocarSenha(event) {
    event.preventDefault()

    setErro('')
    setSucesso('')

    const senhaDigitada = novaSenha.trim()
    const confirmarSenhaDigitada = confirmarSenha.trim()

    if (!senhaDigitada || !confirmarSenhaDigitada) {
      setErro('Preencha a nova senha e a confirmação.')
      return
    }

    const erroSenha = validarSenha(senhaDigitada)

    if (erroSenha) {
      setErro(erroSenha)
      return
    }

    if (senhaDigitada !== confirmarSenhaDigitada) {
      setErro('As senhas não coincidem.')
      return
    }

    setCarregando(true)

    const { error } = await supabase
      .from('usuarios')
      .update({ senha: senhaDigitada })
      .eq('id', usuarioEncontrado.id)

    setCarregando(false)

    if (error) {
      console.log('Erro Supabase:', error)
      setErro(`Erro ao trocar senha: ${error.message}`)
      return
    }

    setSucesso('Senha alterada com sucesso! Você já pode voltar para o login.')
    setNovaSenha('')
    setConfirmarSenha('')
  }

  return (
    <div className="recover-page">
      <main className="recover-main">
        <div className="recover-card">
          <div className="recover-header">
            <div className="recover-logo">
              <span>C</span>
            </div>

            <span className="recover-brand">Cursos</span>
          </div>

          <div className="recover-title">
            <h1>Recuperar senha</h1>

            <p>
              Primeiro informe seu email. Se ele existir, você poderá criar uma nova senha.
            </p>
          </div>

          {!usuarioEncontrado && (
            <form className="recover-form" onSubmit={handleBuscarEmail} noValidate>
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
                    setSucesso('')
                  }}
                  className={erro ? 'input-error' : ''}
                  required
                />
              </div>

              {erro && (
                <div className="recover-error">
                  <span className="recover-error-icon">!</span>
                  <span>{erro}</span>
                </div>
              )}

              {sucesso && (
                <div className="recover-success">
                  <span className="recover-success-icon">✓</span>
                  <span>{sucesso}</span>
                </div>
              )}

              <button className="recover-button" type="submit" disabled={carregando}>
                {carregando ? 'Verificando...' : 'Verificar email'}
              </button>

              <button
                className="recover-back-button"
                type="button"
                onClick={irParaLogin}
              >
                Voltar para login
              </button>
            </form>
          )}

          {usuarioEncontrado && (
            <form className="recover-form" onSubmit={handleTrocarSenha} noValidate>
              <div className="recover-user-box">
                <span>Conta encontrada:</span>
                <strong>{usuarioEncontrado.email}</strong>
              </div>

              <div className="form-group">
                <label htmlFor="novaSenha">Nova senha</label>

                <div className="password-wrapper">
                  <input
                    id="novaSenha"
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="Mín. 6, maiúscula e especial"
                    autoComplete="new-password"
                    value={novaSenha}
                    onChange={(event) => {
                      setNovaSenha(event.target.value)
                      setErro('')
                      setSucesso('')
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

              <div className="form-group">
                <label htmlFor="confirmarSenha">Confirmar nova senha</label>

                <input
                  id="confirmarSenha"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                  value={confirmarSenha}
                  onChange={(event) => {
                    setConfirmarSenha(event.target.value)
                    setErro('')
                    setSucesso('')
                  }}
                  className={erro ? 'input-error' : ''}
                  required
                />
              </div>

              {erro && (
                <div className="recover-error">
                  <span className="recover-error-icon">!</span>
                  <span>{erro}</span>
                </div>
              )}

              {sucesso && (
                <div className="recover-success">
                  <span className="recover-success-icon">✓</span>
                  <span>{sucesso}</span>
                </div>
              )}

              <button className="recover-button" type="submit" disabled={carregando}>
                {carregando ? 'Alterando...' : 'Alterar senha'}
              </button>

              <button
                className="recover-back-button"
                type="button"
                onClick={irParaLogin}
              >
                Voltar para login
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="recover-footer">
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

export default RecuperarSenha
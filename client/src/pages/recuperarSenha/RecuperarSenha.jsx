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

  const [errosCampos, setErrosCampos] = useState({
    email: '',
    novaSenha: '',
    confirmarSenha: '',
  })

  function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regexEmail.test(email)
  }

  function validarCampoEmail(valor) {
    const emailTratado = valor.trim().toLowerCase()

    if (!emailTratado) {
      return 'Informe seu email.'
    }

    if (!validarEmail(emailTratado)) {
      return 'Digite um email válido.'
    }

    return ''
  }

  function validarSenha(valor) {
    const senhaTratada = valor.trim()

    if (!senhaTratada) {
      return 'Informe a nova senha.'
    }

    if (senhaTratada.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres.'
    }

    if (!/[a-z]/.test(senhaTratada)) {
      return 'A senha deve conter pelo menos uma letra minúscula.'
    }

    if (!/[A-Z]/.test(senhaTratada)) {
      return 'A senha deve conter pelo menos uma letra maiúscula.'
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(senhaTratada)) {
      return 'A senha deve conter pelo menos um caractere especial.'
    }

    return ''
  }

  function validarConfirmacaoSenha(valorConfirmacao, valorSenha) {
    const confirmacaoTratada = valorConfirmacao.trim()
    const senhaTratada = valorSenha.trim()

    if (!confirmacaoTratada) {
      return 'Confirme a nova senha.'
    }

    if (confirmacaoTratada !== senhaTratada) {
      return 'As senhas não coincidem.'
    }

    return ''
  }

  function validarCampo(nomeCampo, valor) {
    let mensagem = ''

    if (nomeCampo === 'email') {
      mensagem = validarCampoEmail(valor)
    }

    if (nomeCampo === 'novaSenha') {
      mensagem = validarSenha(valor)
    }

    if (nomeCampo === 'confirmarSenha') {
      mensagem = validarConfirmacaoSenha(valor, novaSenha)
    }

    setErrosCampos((errosAtuais) => ({
      ...errosAtuais,
      [nomeCampo]: mensagem,
    }))

    return mensagem
  }

  function validarSenhaCompleta() {
    const novosErros = {
      email: '',
      novaSenha: validarSenha(novaSenha),
      confirmarSenha: validarConfirmacaoSenha(confirmarSenha, novaSenha),
    }

    setErrosCampos(novosErros)

    return Object.values(novosErros).some((mensagem) => mensagem)
  }

  async function handleBuscarEmail(event) {
    event.preventDefault()

    setErro('')
    setSucesso('')
    setUsuarioEncontrado(null)
    setNovaSenha('')
    setConfirmarSenha('')

    const emailDigitado = email.trim().toLowerCase()
    const erroEmail = validarCampoEmail(emailDigitado)

    setErrosCampos({
      email: erroEmail,
      novaSenha: '',
      confirmarSenha: '',
    })

    if (erroEmail) {
      setErro('Corrija o email antes de continuar.')
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

    const temErro = validarSenhaCompleta()

    if (temErro) {
      setErro('Corrija os campos destacados antes de continuar.')
      return
    }

    const senhaDigitada = novaSenha.trim()

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
    setErrosCampos({
      email: '',
      novaSenha: '',
      confirmarSenha: '',
    })
  }

  function handleEmailChange(event) {
    const valor = event.target.value
    setEmail(valor)
    setErro('')
    setSucesso('')

    if (errosCampos.email) {
      validarCampo('email', valor)
    }
  }

  function handleNovaSenhaChange(event) {
    const valor = event.target.value
    setNovaSenha(valor)
    setErro('')
    setSucesso('')

    if (errosCampos.novaSenha) {
      validarCampo('novaSenha', valor)
    }

    if (errosCampos.confirmarSenha) {
      setErrosCampos((errosAtuais) => ({
        ...errosAtuais,
        confirmarSenha: validarConfirmacaoSenha(confirmarSenha, valor),
      }))
    }
  }

  function handleConfirmarSenhaChange(event) {
    const valor = event.target.value
    setConfirmarSenha(valor)
    setErro('')
    setSucesso('')

    if (errosCampos.confirmarSenha) {
      validarCampo('confirmarSenha', valor)
    }
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
                  onChange={handleEmailChange}
                  onBlur={() => validarCampo('email', email)}
                  className={errosCampos.email ? 'input-error' : ''}
                  required
                />

                {errosCampos.email && (
                  <span className="field-error">{errosCampos.email}</span>
                )}
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
                    onChange={handleNovaSenhaChange}
                    onBlur={() => validarCampo('novaSenha', novaSenha)}
                    className={errosCampos.novaSenha ? 'input-error' : ''}
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

                {errosCampos.novaSenha && (
                  <span className="field-error">{errosCampos.novaSenha}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmarSenha">Confirmar nova senha</label>

                <input
                  id="confirmarSenha"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                  value={confirmarSenha}
                  onChange={handleConfirmarSenhaChange}
                  onBlur={() => validarCampo('confirmarSenha', confirmarSenha)}
                  className={errosCampos.confirmarSenha ? 'input-error' : ''}
                  required
                />

                {errosCampos.confirmarSenha && (
                  <span className="field-error">{errosCampos.confirmarSenha}</span>
                )}
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
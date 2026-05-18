import { useState } from 'react'
import './Cadastro.css'
import { createUser } from '../../services/userService'

function Cadastro({ irParaLogin }) {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const [errosCampos, setErrosCampos] = useState({
    nome: '',
    telefone: '',
    email: '',
    senha: '',
  })

  function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regexEmail.test(email)
  }

  function validarNome(valor) {
    const nomeTratado = valor.trim()

    if (!nomeTratado) {
      return 'Informe seu nome.'
    }

    if (nomeTratado.length < 3) {
      return 'O nome deve ter pelo menos 3 caracteres.'
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nomeTratado)) {
      return 'O nome deve conter apenas letras e espaços.'
    }

    return ''
  }

  function validarTelefone(valor) {
    const telefoneTratado = valor.trim()

    if (!telefoneTratado) {
      return 'Informe seu telefone.'
    }

    if (!/^\d+$/.test(telefoneTratado)) {
      return 'O telefone deve conter apenas números.'
    }

    if (telefoneTratado.length !== 11) {
      return 'O telefone deve ter exatamente 11 números. Exemplo: 11999999999.'
    }

    return ''
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
      return 'Informe sua senha.'
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

  function validarCampo(nomeCampo, valor) {
    let mensagem = ''

    if (nomeCampo === 'nome') {
      mensagem = validarNome(valor)
    }

    if (nomeCampo === 'telefone') {
      mensagem = validarTelefone(valor)
    }

    if (nomeCampo === 'email') {
      mensagem = validarCampoEmail(valor)
    }

    if (nomeCampo === 'senha') {
      mensagem = validarSenha(valor)
    }

    setErrosCampos((errosAtuais) => ({
      ...errosAtuais,
      [nomeCampo]: mensagem,
    }))

    return mensagem
  }

  function validarCadastroCompleto() {
    const novosErros = {
      nome: validarNome(nome),
      telefone: validarTelefone(telefone),
      email: validarCampoEmail(email),
      senha: validarSenha(senha),
    }

    setErrosCampos(novosErros)

    return Object.values(novosErros).some((mensagem) => mensagem)
  }

  async function handleCadastro(event) {
    event.preventDefault()

    setErro('')
    setSucesso('')

    const temErro = validarCadastroCompleto()

    if (temErro) {
      setErro('Corrija os campos destacados antes de continuar.')
      return
    }

    const nomeDigitado = nome.trim()
    const telefoneDigitado = telefone.trim()
    const emailDigitado = email.trim().toLowerCase()
    const senhaDigitada = senha.trim()

    setCarregando(true)

    try {
      await createUser({
        nome: nomeDigitado,
        telefone: telefoneDigitado,
        email: emailDigitado,
        senha: senhaDigitada,
      })
      setSucesso('Cadastro realizado com sucesso!')
    } catch (err) {
      setErro(err.message)
      setCarregando(false)
      return
    }

    setCarregando(false)
    setNome('')
    setTelefone('')
    setEmail('')
    setSenha('')
    setErrosCampos({
      nome: '',
      telefone: '',
      email: '',
      senha: '',
    })
  }

  function handleNomeChange(event) {
    const valor = event.target.value
    setNome(valor)
    setErro('')
    setSucesso('')

    if (errosCampos.nome) {
      validarCampo('nome', valor)
    }
  }

  function handleTelefoneChange(event) {
    const somenteNumeros = event.target.value.replace(/\D/g, '').slice(0, 11)
    setTelefone(somenteNumeros)
    setErro('')
    setSucesso('')

    if (errosCampos.telefone) {
      validarCampo('telefone', somenteNumeros)
    }
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

  function handleSenhaChange(event) {
    const valor = event.target.value
    setSenha(valor)
    setErro('')
    setSucesso('')

    if (errosCampos.senha) {
      validarCampo('senha', valor)
    }
  }

  return (
    <div className="cadastro-page">
      <main className="cadastro-main">
        <div className="cadastro-card">
          <div className="cadastro-header">
            <div className="cadastro-logo">
              <span>C</span>
            </div>

            <span className="cadastro-brand">Cursos</span>
          </div>

          <div className="cadastro-title">
            <h1>Criar conta</h1>

            <p>
              Já tem uma conta?{' '}
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  irParaLogin()
                }}
              >
                Entrar
              </a>
            </p>
          </div>

          <form className="cadastro-form" onSubmit={handleCadastro} noValidate>
            <div className="form-group">
              <label htmlFor="nome">Nome</label>

              <input
                id="nome"
                type="text"
                placeholder="Seu nome"
                autoComplete="name"
                value={nome}
                onChange={handleNomeChange}
                onBlur={() => validarCampo('nome', nome)}
                className={errosCampos.nome ? 'input-error' : ''}
                required
              />

              {errosCampos.nome && (
                <span className="field-error">{errosCampos.nome}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>

              <input
                id="telefone"
                type="text"
                inputMode="numeric"
                placeholder="11999999999"
                autoComplete="tel"
                value={telefone}
                maxLength={11}
                onChange={handleTelefoneChange}
                onBlur={() => validarCampo('telefone', telefone)}
                className={errosCampos.telefone ? 'input-error' : ''}
                required
              />

              {errosCampos.telefone && (
                <span className="field-error">{errosCampos.telefone}</span>
              )}
            </div>

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

            <div className="form-group">
              <label htmlFor="senha">Senha</label>

              <div className="password-wrapper">
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Mín. 6, maiúscula e especial"
                  autoComplete="new-password"
                  value={senha}
                  onChange={handleSenhaChange}
                  onBlur={() => validarCampo('senha', senha)}
                  className={errosCampos.senha ? 'input-error' : ''}
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

              {errosCampos.senha && (
                <span className="field-error">{errosCampos.senha}</span>
              )}
            </div>

            {erro && <p className="cadastro-error">{erro}</p>}
            {sucesso && <p className="cadastro-success">{sucesso}</p>}

            <button className="cadastro-button" type="submit" disabled={carregando}>
              {carregando ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        </div>
      </main>

      <footer className="cadastro-footer">
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

export default Cadastro
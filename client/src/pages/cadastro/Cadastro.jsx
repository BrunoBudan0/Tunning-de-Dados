import { useState } from 'react'
import './Cadastro.css'
import { supabase } from '../../lib/supabase'

function Cadastro() {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regexEmail.test(email)
  }

  function validarCadastro({ nome, telefone, email, senha }) {
    if (!nome || !telefone || !email || !senha) {
      return 'Preencha todos os campos.'
    }

    if (nome.length < 3) {
      return 'O nome deve ter pelo menos 3 caracteres.'
    }

    if (telefone.length < 10 || telefone.length > 11) {
      return 'O telefone deve ter 10 ou 11 números. Exemplo: 11999999999.'
    }

    if (!validarEmail(email)) {
      return 'Digite um email válido.'
    }

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

  async function handleCadastro(event) {
    event.preventDefault()

    setErro('')
    setSucesso('')

    const nomeDigitado = nome.trim()
    const telefoneDigitado = telefone.trim()
    const emailDigitado = email.trim().toLowerCase()
    const senhaDigitada = senha.trim()

    const mensagemErro = validarCadastro({
      nome: nomeDigitado,
      telefone: telefoneDigitado,
      email: emailDigitado,
      senha: senhaDigitada,
    })

    if (mensagemErro) {
      setErro(mensagemErro)
      return
    }

    setCarregando(true)

    const { error } = await supabase
      .from('usuarios')
      .insert([
        {
          nome: nomeDigitado,
          telefone: telefoneDigitado,
          email: emailDigitado,
          senha: senhaDigitada,
        },
      ])

    setCarregando(false)

    if (error) {
      console.log('Erro Supabase:', error)

      if (error.code === '23505') {
        setErro('Este email já está cadastrado.')
        return
      }

      setErro(`Erro ao cadastrar usuário: ${error.message}`)
      return
    }

    setSucesso('Cadastro realizado com sucesso!')
    setNome('')
    setTelefone('')
    setEmail('')
    setSenha('')
  }

  function handleTelefoneChange(event) {
    const somenteNumeros = event.target.value.replace(/\D/g, '').slice(0, 11)
    setTelefone(somenteNumeros)
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
              <a href="#">
                Entrar
              </a>
            </p>
          </div>

          <form className="cadastro-form" onSubmit={handleCadastro}>
            <div className="form-group">
              <label htmlFor="nome">Nome</label>

              <input
                id="nome"
                type="text"
                placeholder="Seu nome"
                autoComplete="name"
                value={nome}
                minLength={3}
                onChange={(event) => setNome(event.target.value)}
                required
              />
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
                minLength={10}
                maxLength={11}
                onChange={handleTelefoneChange}
                required
              />
            </div>

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
              <label htmlFor="senha">Senha</label>

              <div className="password-wrapper">
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Mín. 6, maiúscula e especial"
                  autoComplete="new-password"
                  value={senha}
                  minLength={6}
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
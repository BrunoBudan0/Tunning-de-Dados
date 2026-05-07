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

  async function handleCadastro(event) {
    event.preventDefault()

    setErro('')
    setSucesso('')
    setCarregando(true)

    const nomeDigitado = nome.trim()
    const telefoneDigitado = telefone.trim()
    const emailDigitado = email.trim()
    const senhaDigitada = senha.trim()

    if (!nomeDigitado || !telefoneDigitado || !emailDigitado || !senhaDigitada) {
      setErro('Preencha todos os campos.')
      setCarregando(false)
      return
    }

    const { data: usuarioExistente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', emailDigitado)
      .maybeSingle()

    if (usuarioExistente) {
      setErro('Este email já está cadastrado.')
      setCarregando(false)
      return
    }

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
      setErro('Erro ao cadastrar usuário.')
      return
    }

    setSucesso('Cadastro realizado com sucesso!')
    setNome('')
    setTelefone('')
    setEmail('')
    setSenha('')
  }

  function handleTelefoneChange(event) {
    const somenteNumeros = event.target.value.replace(/\D/g, '')
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
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
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
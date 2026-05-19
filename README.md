# Plataforma EAD — Tunning de Dados

> Projeto acadêmico (FEI — Performance e Tunning de Dados) de uma plataforma de ensino a distância (EAD) construída em **arquitetura MVC + DAO** com **persistência poliglota** (PostgreSQL via Supabase, MongoDB e Apache Cassandra).

**Stack:** React + Vite · Node.js + Express · MongoDB · Supabase (PostgreSQL) · Apache Cassandra

---

## Índice

1. [Visão geral](#1-visão-geral)
2. [Arquitetura](#2-arquitetura)
3. [Estrutura de pastas](#3-estrutura-de-pastas)
4. [Pré-requisitos](#4-pré-requisitos)
5. [Instalação](#5-instalação)
6. [Variáveis de ambiente](#6-variáveis-de-ambiente)
7. [Como rodar](#7-como-rodar)
8. [Bancos de dados — distribuição](#8-bancos-de-dados--distribuição)
9. [Endpoints da API](#9-endpoints-da-api)
10. [Funcionalidades](#10-funcionalidades)
11. [Convenções e boas práticas](#11-convenções-e-boas-práticas)
12. [Equipe](#12-equipe)

---

## 1. Visão geral

A Plataforma EAD permite que alunos:

- Se cadastrem e façam login na plataforma.
- Naveguem por um catálogo de cursos.
- Matriculem-se em cursos gratuitamente.
- Assistam aulas e marquem-nas como concluídas.
- Acompanhem o progresso individual em cada curso pelo perfil.

E que administradores:

- Criem novos cursos com suas respectivas aulas.
- Removam cursos do catálogo (com remoção em cascata das aulas).

O sistema é um **monorepo**: uma única pasta raiz contendo dois projetos independentes — o front-end (`client/`) e o back-end (`server/`) — que se comunicam **exclusivamente via HTTP**.

---

## 2. Arquitetura

O projeto segue o padrão **MVC + DAO** com **separação total** entre front-end e back-end. Cada camada tem uma responsabilidade única e bem delimitada.

```
[ Página React ] → [ Service ] → HTTP → [ Route ] → [ Controller ] → [ DAO ] → [ Banco ]
                                                          ↑
                                                       [ Model ]
```

### Fluxo de uma requisição (exemplo: listar cursos)

1. Usuário clica em **Explorar**
2. `Catalogo.jsx` chama `getCourses()`
3. `courseService.js` faz `fetch("http://localhost:3000/api/courses")`
4. Express direciona para `courseRoutes.js`
5. `CourseController.getAll()` chama `CourseDAO.findAll()`
6. `CourseDAO` consulta o MongoDB
7. Documentos voltam até o React, que renderiza o catálogo

### Responsabilidades por camada

| Camada       | Arquivo              | Responsabilidade                          | Não faz                       |
| ------------ | -------------------- | ----------------------------------------- | ----------------------------- |
| Página       | `Catalogo.jsx`       | Exibir dados, capturar eventos            | Fetch direto, lógica negócio  |
| Service      | `courseService.js`   | Requisições HTTP ao back-end              | Renderização, lógica negócio  |
| Route        | `courseRoutes.js`    | Mapear URL + método → controller          | Lógica ou banco               |
| Controller   | `CourseController.js`| Orquestrar DAO, tratar erros, responder   | Acessar banco diretamente     |
| DAO          | `CourseDAO.js`       | Queries e operações no banco              | Lógica de negócio             |
| Model        | `Course.js`          | Representar a entidade do domínio (OOP)   | Banco, HTTP, renderização     |

> **Regra de ouro:** Cada camada conversa apenas com a camada imediatamente abaixo. Nenhum componente React faz `fetch()` direto; nenhum Controller acessa o banco diretamente.

---

## 3. Estrutura de pastas

```
TunningDadosProjeto/
├── client/                          # React + Vite (front-end)
│   └── src/
│       ├── pages/                   # Telas da aplicação
│       │   ├── login/               # Login
│       │   ├── cadastro/            # Cadastro de usuário
│       │   ├── recuperarSenha/      # Recuperação de senha
│       │   ├── home/                # Página inicial (hero)
│       │   ├── catalogo/            # Catálogo de cursos
│       │   ├── detalhe-curso/       # Detalhe + matrícula + aulas
│       │   ├── perfil/              # Perfil + progresso real
│       │   └── admin/               # CRUD de cursos
│       ├── components/              # Reutilizáveis
│       │   ├── Header/
│       │   └── BottomNav/
│       ├── services/                # Única camada que conhece o back-end
│       │   ├── userService.js
│       │   ├── courseService.js
│       │   ├── aulaService.js
│       │   └── progressoService.js
│       ├── App.jsx                  # Roteamento por estado (useState)
│       └── main.jsx
│
└── server/                          # Node + Express (back-end)
    ├── config/                      # Conexões com os bancos
    │   ├── supabase.js
    │   ├── mongodb.js
    │   └── cassandra.js
    ├── models/                      # Classes OOP (entidades)
    │   ├── User.js
    │   ├── Course.js
    │   ├── Aula.js
    │   ├── Progresso.js
    │   ├── CursoUsuario.js
    │   └── AulaUsuario.js
    ├── dao/                         # Acesso ao banco
    │   ├── UserDAO.js               # Supabase
    │   ├── CourseDAO.js             # MongoDB
    │   ├── AulaDAO.js               # MongoDB
    │   ├── ProgressoDAO.js          # Cassandra
    │   ├── CursosUsuarioDAO.js      # Cassandra
    │   └── AulaUsuarioDAO.js        # Cassandra
    ├── controllers/                 # Lógica de negócio
    │   ├── UserController.js
    │   ├── CourseController.js
    │   ├── AulaController.js
    │   └── ProgressoController.js
    ├── routes/                      # Mapeamento de URLs
    │   ├── userRoutes.js
    │   ├── courseRoutes.js
    │   ├── aulaRoutes.js
    │   └── progressoRoutes.js
    └── server.js                    # Entry point
```

---

## 4. Pré-requisitos

- **Node.js** v18 ou superior
- **npm** (vem com o Node)
- **Git**
- Acesso aos três bancos de dados (ver [seção 8](#8-bancos-de-dados--distribuição))

```bash
node -v
npm -v
git --version
```

---

## 5. Instalação

### 5.1 Clonar o repositório

```bash
git clone https://github.com/BrunoBudan0/Tunning-de-Dados.git
cd Tunning-de-Dados
```

### 5.2 Back-end

```bash
cd server
npm install
```

Pacotes principais do back-end:

| Pacote                    | Tipo       | Função                                  |
| ------------------------- | ---------- | --------------------------------------- |
| `express`                 | Principal  | Servidor HTTP e roteamento              |
| `cors`                    | Principal  | Libera acesso do React ao servidor      |
| `dotenv`                  | Principal  | Carrega variáveis do arquivo `.env`     |
| `@supabase/supabase-js`   | Banco      | Cliente do Supabase (PostgreSQL)        |
| `mongoose`                | Banco      | ODM para MongoDB                        |
| `cassandra-driver`        | Banco      | Driver oficial do Apache Cassandra      |
| `nodemon`                 | Dev        | Reinicia o servidor ao salvar           |

### 5.3 Front-end

```bash
cd ../client
npm install
```

Pacotes principais do front-end:

| Pacote        | Tipo       | Função                       |
| ------------- | ---------- | ---------------------------- |
| `react`       | Principal  | Biblioteca de UI             |
| `react-dom`   | Principal  | Renderização no navegador    |
| `vite`        | Dev        | Bundler com hot reload       |

---

## 6. Variáveis de ambiente

No diretório `server/`, crie um arquivo `.env` com as credenciais dos três bancos:

```dotenv
# Supabase (PostgreSQL — usuários)
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=sua_chave_aqui

# MongoDB (cursos e aulas)
MONGO_URI=mongodb://localhost:27017/ead

# Cassandra (progresso, matrículas, histórico)
CASSANDRA_CONTACT_POINTS=127.0.0.1
CASSANDRA_DATACENTER=datacenter1
CASSANDRA_KEYSPACE=ead

# Porta do servidor
PORT=3000
```

> ⚠️ Nunca comite o `.env` no Git. As credenciais ficam apenas localmente.

### Estrutura do keyspace Cassandra

```cql
CREATE KEYSPACE ead WITH replication = {
  'class': 'SimpleStrategy', 'replication_factor': 1
};

USE ead;

CREATE TABLE progresso (
  id_usuario  text,
  id_curso    text,
  percentual  int,
  atualizado_em timestamp,
  PRIMARY KEY (id_usuario, id_curso)
);

CREATE TABLE cursos_usuario (
  id_usuario text,
  id_curso   text,
  matriculado_em timestamp,
  PRIMARY KEY (id_usuario, id_curso)
);

CREATE TABLE aula_usuario (
  id_usuario  text,
  id_aula     text,
  concluida   boolean,
  concluida_em timestamp,
  PRIMARY KEY (id_usuario, id_aula)
);
```

---

## 7. Como rodar

O projeto exige **dois terminais** rodando simultaneamente:

```bash
# Terminal 1 — back-end (localhost:3000)
cd server
npm run dev          # nodemon — reinicia ao salvar
```

```bash
# Terminal 2 — front-end (localhost:5173)
cd client
npm run dev          # Vite — hot reload
```

### Verificação rápida

- Front-end: <http://localhost:5173>
- API: <http://localhost:3000/api/courses>

O CORS no `server.js` já está configurado para liberar `http://localhost:5173`.

---

## 8. Bancos de dados — distribuição

O projeto utiliza **persistência poliglota**: cada tipo de dado vai para o banco que melhor o serve.

| Banco       | Tipo        | DAO                 | Justificativa                                    |
| ----------- | ----------- | ------------------- | ------------------------------------------------ |
| Supabase    | PostgreSQL  | `UserDAO`           | Dados estruturados e autenticação                |
| MongoDB     | Document    | `CourseDAO`, `AulaDAO` | Conteúdo flexível (cursos com aulas variáveis) |
| Cassandra   | Wide-column | `ProgressoDAO`, `CursosUsuarioDAO`, `AulaUsuarioDAO` | Alta escrita: progresso, matrículas e histórico |

### Identificador canônico de curso

Os cursos usam o campo lógico **`IDCurso`** (ex: `"curso_1"`) como identificador em toda a stack — não o `_id` do MongoDB. Isso garante consistência entre os três bancos (já que Cassandra armazena `id_curso` como `text`).

---

## 9. Endpoints da API

Base URL: `http://localhost:3000/api`

### 👤 Usuários — `/api/users`

| Método | Rota                       | Descrição                          |
| ------ | -------------------------- | ---------------------------------- |
| POST   | `/api/users`               | Cadastrar usuário                  |
| POST   | `/api/users/login`         | Login (email + senha)              |
| GET    | `/api/users/:id`           | Buscar usuário por ID              |
| GET    | `/api/users/email/:email`  | Buscar usuário por e-mail          |
| PATCH  | `/api/users/:id/senha`     | Atualizar senha                    |

### 📚 Cursos — `/api/courses`

| Método | Rota                  | Descrição                  |
| ------ | --------------------- | -------------------------- |
| GET    | `/api/courses`        | Listar todos os cursos     |
| GET    | `/api/courses/:id`    | Buscar curso por IDCurso   |
| POST   | `/api/courses`        | Criar novo curso           |
| DELETE | `/api/courses/:id`    | Remover curso              |

### 🎬 Aulas — `/api/aulas`

| Método | Rota                       | Descrição                    |
| ------ | -------------------------- | ---------------------------- |
| GET    | `/api/aulas/curso/:IDCurso`| Listar aulas de um curso     |
| GET    | `/api/aulas/:id`           | Buscar aula por ID           |
| POST   | `/api/aulas`               | Criar aula                   |
| DELETE | `/api/aulas/:id`           | Remover aula                 |

### 📊 Progresso — `/api/progresso`

| Método | Rota                                        | Descrição                                       |
| ------ | ------------------------------------------- | ----------------------------------------------- |
| GET    | `/api/progresso/matriculas/:id_usuario`     | Lista as matrículas do usuário                  |
| GET    | `/api/progresso/aulas/:id_usuario`          | Aulas que o usuário já concluiu                 |
| GET    | `/api/progresso/:id_usuario/:id_curso`      | Progresso em um curso específico                |
| GET    | `/api/progresso/:id_usuario`                | Todos os progressos do usuário                  |
| POST   | `/api/progresso/matricular`                 | Matricula o usuário (inicia progresso e aulas)  |
| POST   | `/api/progresso`                            | Salva/atualiza progresso                        |
| PATCH  | `/api/progresso/aula`                       | Marca aula como concluída e atualiza %          |

---

## 10. Funcionalidades

### Implementadas

- ✅ **Autenticação** (cadastro, login, recuperação de senha) — Supabase
- ✅ **Catálogo de cursos** com busca e filtro por categoria — MongoDB
- ✅ **Detalhe do curso** com lista de aulas reais — MongoDB
- ✅ **Matrícula gratuita** em um clique — Cassandra
- ✅ **Conclusão de aulas** com atualização automática do % — Cassandra
- ✅ **Barra de progresso real** no detalhe do curso e no perfil
- ✅ **Perfil do usuário** com estatísticas reais (cursos matriculados, concluídos, % médio)
- ✅ **Painel administrativo** para criar e excluir cursos com suas aulas

### Telas do front-end

| Tela              | Componente             | Descrição                              |
| ----------------- | ---------------------- | -------------------------------------- |
| Login             | `Login.jsx`            | Autenticação via Supabase              |
| Cadastro          | `Cadastro.jsx`         | Novo usuário                           |
| Recuperar senha   | `RecuperarSenha.jsx`   | Atualização de senha por e-mail        |
| Home              | `Home.jsx`             | Hero institucional                     |
| Catálogo          | `Catalogo.jsx`         | Lista de cursos com filtros            |
| Detalhe do curso  | `DetalheCurso.jsx`     | Matrícula + abas (Visão, Conteúdo)     |
| Perfil            | `Perfil.jsx`           | Cursos matriculados + estatísticas     |
| Admin             | `Admin.jsx`            | Criar / excluir cursos                 |

---

## 11. Convenções e boas práticas

### Regras de ouro da arquitetura

- 🚫 **Nunca** faça `fetch()` diretamente em um componente React — sempre passe pelo **service**.
- 🚫 **Nunca** acesse o banco no Controller — sempre passe pelo **DAO**.
- 🚫 **Mantenha os Models livres** de qualquer dependência de banco.
- ✅ Use `.bind(Controller)` ao passar métodos de classe como callbacks de rota.
- ✅ Sempre trate erros com `try/catch` nos Controllers.
- ✅ Sempre verifique `res.ok` nos services antes de chamar `.json()`.

### Ordem ao implementar uma nova funcionalidade

> **De baixo para cima:** Model → DAO → Controller → Route → testar no Insomnia → Service → Página

1. Crie ou atualize o **Model** em `server/models/`
2. Implemente as operações no **DAO** em `server/dao/`
3. Escreva os métodos no **Controller** em `server/controllers/`
4. Adicione as rotas em `server/routes/`
5. **Teste no Insomnia/Postman** antes de tocar no front-end
6. Adicione a função no **service** em `client/src/services/`
7. Use o service na **página/componente** React

### Segurança

- Credenciais ficam apenas no `.env` — nunca no código nem no Git.
- O `.env.example` (sem segredos) pode ser commitado como referência.

---

## 12. Equipe

Projeto desenvolvido para a disciplina **Performance e Tunning de Dados** — FEI.

- **Repositório:** <https://github.com/BrunoBudan0/Tunning-de-Dados>

---

> Projeto EAD — FEI | Tunning de Dados

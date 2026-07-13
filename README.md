# 👓 OptiManager

Sistema web para gerenciamento de óticas, desenvolvido para facilitar o cadastro de clientes, controle de consultas oftalmológicas e organização do histórico clínico.

O projeto foi desenvolvido utilizando tecnologias modernas do ecossistema JavaScript/TypeScript, com foco em performance, segurança e experiência do usuário.

---

## ✨ Funcionalidades

### 🔐 Autenticação

* Login seguro utilizando Auth.js
* Rotas protegidas
* Controle de sessão
* Logout

### 👤 Clientes

* Cadastro de clientes
* Pesquisa rápida por nome
* Edição
* Exclusão com validação de integridade
* Histórico completo

### 👓 Consultas

* Cadastro de consultas
* Histórico por cliente
* Edição
* Visualização detalhada
* Registro de:

  * Olho direito
  * Olho esquerdo
  * Adição
  * Lentes
  * Laboratório
  * Observações
  * Valor
  * Data

### 📊 Dashboard

* Total de clientes
* Total de consultas
* Últimos clientes cadastrados
* Últimas consultas
* Atalhos rápidos

---

# 🚀 Tecnologias

* Next.js 16 (App Router)
* React
* TypeScript
* Tailwind CSS
* Prisma ORM 7
* PostgreSQL (Neon)
* Auth.js (NextAuth v5)
* Zod
* Vercel

---

# 🏗 Arquitetura

O projeto utiliza uma arquitetura moderna baseada em Server Components e Server Actions.

```text
App Router
│
├── Server Components
│
├── Server Actions
│
├── Auth.js
│
├── Prisma ORM
│
└── PostgreSQL
```

Principais características:

* React Server Components
* Server Actions
* Prisma ORM
* Banco PostgreSQL
* Autenticação baseada em sessão
* Layout protegido
* Componentização
* Validação com Zod

---

# 📂 Estrutura

```text
app/
components/
lib/
prisma/
public/
specs/

```

---

# 🔒 Segurança

* Senhas criptografadas com bcrypt
* Rotas protegidas
* Middleware/Proxy de autenticação
* Validação de formulários com Zod
* UUID como chave primária
* Integridade referencial no banco
* Variáveis de ambiente protegidas

---

# 🌐 Deploy

Aplicação hospedada na Vercel.

Banco de dados hospedado na Neon.

---

# ⚙️ Como executar localmente

Clone o projeto

```bash
git clone <url-do-repositorio>
```

Entre na pasta

```bash
cd optimanager
```

Instale as dependências

```bash
npm install
```

Configure as variáveis de ambiente

```env
DATABASE_URL=
AUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

Execute as migrations

```bash
npx prisma migrate deploy
```

Execute o seed

```bash
npx prisma db seed
```

Inicie o projeto

```bash
npm run dev
```

---

# 📸 Demonstração

Sugestão de imagens para adicionar:

* Tela inicial
* Login
* Dashboard
* Cadastro de cliente
* Perfil do cliente
* Cadastro de consulta

---

# 💡 Objetivo

O OptiManager nasceu para solucionar um problema real de gestão em uma ótica, simplificando o cadastro de clientes e o controle das consultas oftalmológicas.

O foco do projeto foi desenvolver uma aplicação moderna, segura e preparada para evolução futura.

---

# 🛣 Roadmap

* [x] Login
* [x] Dashboard
* [x] Cadastro de clientes
* [x] Pesquisa
* [x] Cadastro de consultas
* [x] Histórico por cliente
* [x] Deploy em produção

Próximas funcionalidades:

* [ ] Impressão de receitas
* [ ] Exportação em PDF
* [ ] Upload de documentos
* [ ] Multiusuário
* [ ] Controle de permissões
* [ ] Dashboard financeiro
* [ ] Relatórios
* [ ] Backup automático

---

# 👨‍💻 Autor

**José Everton**

Desenvolvedor Full Stack

Tecnologias de interesse:

* JavaScript
* TypeScript
* React
* Next.js
* Node.js
* Prisma
* PostgreSQL
* Inteligência Artificial

LinkedIn e portfólio poderão ser adicionados futuramente.

---

## ⭐ Sobre este projeto

Este projeto foi desenvolvido como uma aplicação real para uso em uma ótica, aplicando boas práticas de arquitetura, autenticação, banco de dados, validação, componentização e deploy em produção.

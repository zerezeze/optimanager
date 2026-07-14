# 👓 OptiManager

Sistema web para gerenciamento de óticas, desenvolvido para facilitar o cadastro de clientes, controle de consultas oftalmológicas e organização do histórico clínico.

O projeto foi desenvolvido utilizando tecnologias modernas do ecossistema JavaScript/TypeScript, com foco em performance, segurança e experiência do usuário.

---

## ✨ Funcionalidades

### 🔐 Autenticação & Isolamento Multi-Tenant

* Login seguro utilizando Auth.js (NextAuth v5)
* Isolamento de dados multiusuário (Multi-Tenant) no nível de banco de dados
* Controle de sessão e privilégios fortemente tipados (ADMIN / OPERATOR)
* Camada centralizada de controle de acesso e auditoria no servidor (helpers de autorização)
* Proteção estrita de rotas administrativas e redirecionamentos automáticos

### 👤 Clientes

* Cadastro de clientes vinculados ao usuário proprietário
* Pesquisa rápida por nome respeitando o isolamento do operador
* Edição e visualização com checagem de autorização no servidor
* Exclusão com validação de integridade e posse do registro
* Histórico completo de consultas do cliente

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
* React 19
* TypeScript
* Tailwind CSS
* Prisma ORM 7
* PostgreSQL (Neon)
* Auth.js (NextAuth v5)
* Zod
* Vercel

---

# 🏗 Arquitetura

O projeto utiliza uma arquitetura baseada em Server Components e Server Actions com isolamento de dados no nível de usuário (Multi-Tenant).

```text
App Router
│
├── Server Components (Filtros de Tenant e autorização de leitura)
│
├── Server Actions (Autorização no servidor, escrita de dados, userId de sessão)
│
├── Camada de Autorização (lib/authz.ts - regras de acesso centralizadas)
│
├── Auth.js (Sessão baseada em JWT com id e role estendidos)
│
├── Prisma ORM
│
└── PostgreSQL (Neon)
```

Principais características:

* **Isolamento de Dados Estrito**: Operadores (`OPERATOR`) acessam apenas seus próprios clientes e consultas correspondentes. Administradores (`ADMIN`) possuem acesso global irrestrito para monitoramento geral do sistema.
* **Segurança no Servidor**: O identificador do proprietário (`userId`) é extraído diretamente dos cookies de sessão criptografados do servidor no momento do processamento, nunca confiando em campos ocultos ou parâmetros enviados pelo cliente/navegador.
* **Helpers Centralizados**: As validações são orquestradas por métodos reutilizáveis (`requireAuthenticated`, `requireAdmin`, `canAccessClient`, `canAccessConsultation`), evitando redundâncias e facilitando auditorias de segurança.

---

# 📂 Estrutura

```text
app/
components/
lib/
  ├── authz.ts (helpers de autorização multi-tenant)
  └── db.ts (singleton Prisma)
prisma/
types/
  └── next-auth.d.ts (declarações de tipos estendidos)
public/
specs/

```

---

# 🔒 Segurança

* Senhas criptografadas com bcryptjs
* Rotas protegidas e regras de acesso por privilégios no Middleware
* Validação de propriedade no nível do registro (Row-Level Security conceitual no Prisma)
* Validação de formulários e tipos com Zod
* UUID como chave primária
* Integridade referencial no banco (onDelete: Restrict)
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
npx prisma migrate dev
```

Execute o seed (cria o Administrador e a Ótica Everardo padrão)

```bash
npm run db:seed
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
* Usuários (Visão do Administrador)

---

# 💡 Objetivo

O OptiManager nasceu para solucionar um problema real de gestão em uma ótica, simplificando o cadastro de clientes, receitas oftalmológicas e o controle das consultas oftalmológicas de forma isolada e profissional.

---

# 🛣 Roadmap

* [x] Login
* [x] Dashboard
* [x] Cadastro de clientes
* [x] Pesquisa
* [x] Cadastro de consultas
* [x] Histórico por cliente
* [x] Deploy em produção
* [x] Multiusuário (Multi-Tenant)
* [x] Controle de permissões (ADMIN / OPERATOR)

Próximas funcionalidades:

* [ ] Impressão de receitas
* [ ] Exportação em PDF
* [ ] Upload de documentos
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

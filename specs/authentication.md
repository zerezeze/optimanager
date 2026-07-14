# Autenticação e Segurança (Auth.js)

## Objetivo

Permitir apenas usuários autorizados e prover isolamento de dados (Multi-Tenant).

## Regras

- Utilização do Next-Auth (Auth.js v5) com a estratégia de "Credentials".
- Senhas são hasheadas utilizando `bcryptjs`.
- Não existe formulário de cadastro público; apenas usuários ADMIN podem criar novos usuários na rota `/usuarios`.
- Middleware do Next.js bloqueia as rotas privadas (`/dashboard`, `/clientes`, `/consultas`, `/usuarios`) redirecionando para `/login`.
- Todo usuário possui uma permissão atrelada (Role: ADMIN ou OPERATOR). Administradores têm acesso global. Operadores visualizam apenas clientes do próprio tenant.

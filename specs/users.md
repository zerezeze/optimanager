# Gestão de Usuários (Autenticação Multi-Tenant)

## 1. Objetivo

Evoluir o OptiManager para suportar múltiplos usuários (óticas) de forma segura através de uma arquitetura multi-tenant, onde cada usuário autenticado (OPERATOR) visualizará exclusivamente seus próprios clientes e consultas, enquanto o administrador (ADMIN) terá acesso global à gestão de contas.

---

## 2. Modelo de Dados (Campos)

O modelo `User` é a base da autenticação e do isolamento de dados:

*   **Identificador Único (`id`)**: UUID gerado de forma randômica e segura.
*   **Nome (`name`)**: Identificação do usuário na interface (String, máx 255 caracteres).
*   **Email (`email`)**: E-mail único utilizado para login (String, máx 255 caracteres).
*   **Senha (`password`)**: Hash da senha (bcrypt) (String, máx 255 caracteres).
*   **Regra (`role`)**: Enumeração `UserRole` (`ADMIN` ou `OPERATOR`). O padrão é `OPERATOR`.
*   **Campos de Auditoria**: `createdAt` e `updatedAt`.

### Isolamento de Dados
*   **Client**: Adicionado campo `userId` (FK apontando para `User.id` com `onDelete: Restrict`).
*   **Consultation**: Relacionado ao `Client`. Consequentemente, o isolamento das consultas é derivado do isolamento do cliente.

---

## 3. Casos de Uso

### 3.1 Gestão Administrativa
*   **Ação**: O usuário administrador (ADMIN) acessa a rota `/usuarios`.
*   **Fluxo**: Exibe a lista de usuários do sistema. Permite criar novas contas de usuários operadores (novas óticas) definindo Nome, Email e Senha.

### 3.2 Login e Sessão
*   **Ação**: O usuário informa email e senha em `/login`.
*   **Fluxo**: O Auth.js valida as credenciais contra a tabela `User` (comparando o hash bcrypt) e popula o JWT/Session com `id`, `name` e `role`.

### 3.3 Acesso Isolado a Clientes e Consultas (Multi-Tenant)
*   **Ação**: O usuário OPERATOR acessa o dashboard, a listagem de clientes ou a ficha de uma consulta.
*   **Fluxo**: O sistema filtra e exibe apenas os registros atrelados ao seu `userId`. O sistema bloqueia tentativas de acesso direto via URL a clientes de outros usuários, retornando 404 (Not Found).

---

## 4. Regras de Negócio

1.  **Centralização de Permissões**: Toda autorização deve acontecer exclusivamente no servidor através do helper `lib/authz.ts`.
2.  **Isolamento Estrito**: Nunca confiar em informações vindas do cliente. O filtro de propriedade (`userId`) deve vir diretamente da sessão autenticada (`auth.user.id`).
3.  **Acesso Global**: Usuários com a role `ADMIN` bypassam o filtro de `userId` e conseguem ver todos os clientes/consultas de todo o banco de dados.
4.  **Proteção de Exclusão**: É proibido excluir o perfil do banco se ele tiver clientes associados (`onDelete: Restrict`).

---

## 5. Critérios de Aceitação

*   [ ] O painel `/usuarios` só é acessível por usuários com role `ADMIN`.
*   [ ] Usuários `OPERATOR` são redirecionados ao tentarem acessar o painel administrativo.
*   [ ] A listagem de clientes filtra os registros onde `userId === session.user.id` (para operadores).
*   [ ] Ao criar um cliente novo, o `userId` inserido no banco é obrigatoriamente o ID do usuário logado na sessão atual.
*   [ ] O middleware de proteção verifica a sessão globalmente (via JWT sem callbacks complexos).

---

## 6. Decisões Técnicas

### 6.1 Lib de Autorização Centralizada
Criado o arquivo `lib/authz.ts` que exporta:
*   `requireAuthenticated()`: Garante que o usuário está logado e retorna a sessão.
*   `canAccessClient(clientId)`: Verifica se o cliente pertence ao usuário da sessão ou se ele é admin.
*   `canAccessConsultation(consultationId)`: Verifica o acesso de forma derivada através da entidade Client relacionada.

### 6.2 Middleware e Edge Compatibility
O middleware do Next.js (Auth.js) em ambiente Edge verifica apenas a existência do cookie de autenticação básico (`!!auth?.user?.email`) e roles simples, enquanto verificações profundas em banco ocorrem nos Server Components e Server Actions usando `lib/authz.ts`.

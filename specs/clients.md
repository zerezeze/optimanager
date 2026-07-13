# Gestão de Clientes

## 1. Objetivo

Centralizar o cadastro e controle de dados dos clientes da Ótica Everardo (OptiManager). A funcionalidade deve permitir que o atendente localize rapidamente os clientes cadastrados, edite suas informações básicas e acesse o histórico de consultas de cada um.

---

## 2. Dados do Cliente

Cada cliente deve conter os seguintes campos representados no banco de dados:

*   **Identificador Único (`id`)**: UUID gerado de forma randômica e segura.
*   **Nome Completo (`nome`)**: Texto obrigatório, limitado a 255 caracteres.
*   **Endereço (`endereco`)**: Texto opcional, limitado a 500 caracteres (pode conter rua, número, bairro, cidade).
*   **Telefone (`telefone`)**: Texto opcional, limitado a 20 caracteres (utilizado para contato direto).
*   **Campos de Auditoria**:
    *   `createdAt`: Data e hora do cadastro inicial (não editável).
    *   `updatedAt`: Data e hora da última modificação.

---

## 3. Casos de Uso

### 3.1 Criar Cliente
*   **Ação**: O operador preenche um formulário contendo Nome, Endereço e Telefone.
*   **Fluxo**: O sistema valida os campos obrigatórios. Se tudo estiver correto, cria o registro e redireciona o operador para a lista de clientes.

### 3.2 Listar Clientes
*   **Ação**: Visualização geral de todos os clientes cadastrados em ordem alfabética ou cronológica de criação.
*   **Fluxo**: Mostra um resumo das informações básicas de cada cliente (Nome e Telefone).

### 3.3 Pesquisar Cliente
*   **Ação**: Busca rápida por nome do cliente.
*   **Fluxo**: À medida que o operador digita (ou ao submeter o formulário de busca), a listagem exibe apenas os clientes cujos nomes coincidam parcial ou totalmente com o termo pesquisado.

### 3.4 Visualizar Detalhes do Cliente
*   **Ação**: Página ou área de detalhamento de um cliente específico.
*   **Fluxo**: Exibe todos os dados do cliente (Nome, Endereço, Telefone) juntamente com a lista cronológica inversa (da mais recente para a mais antiga) de todas as suas consultas ópticas.

### 3.5 Editar Cliente
*   **Ação**: Alterar dados básicos de um cliente já cadastrado.
*   **Fluxo**: O operador clica em "Editar", o formulário é pré-preenchido com os dados atuais e, ao submeter, as alterações são salvas no banco.

### 3.6 Excluir Cliente (Segurança Referencial)
*   **Ação**: Deletar um cliente do sistema.
*   **Fluxo**: O operador solicita a exclusão. Se o cliente **não** possuir consultas vinculadas, o registro é removido com sucesso. Se o cliente **possuir** consultas vinculadas, a exclusão é bloqueada pelo banco e uma mensagem de aviso é exibida.

---

## 4. Regras de Negócio

1.  **Nome Obrigatório**: É vedada a criação ou edição de clientes com o campo de Nome nulo ou em branco.
2.  **Unicidade do ID**: O ID do cliente deve ser gerado no formato UUIDv4.
3.  **Proteção do Histórico (Integridade)**: As consultas históricas nunca devem ser perdidas acidentalmente. A exclusão de um cliente é estritamente proibida caso ele tenha qualquer consulta associada no banco de dados.
4.  **Acesso Restrito**: Somente operadores autenticados no sistema podem ler, criar ou modificar dados de clientes.

---

## 5. Critérios de Aceitação

A funcionalidade será considerada concluída se atender aos seguintes requisitos:
*   [ ] O formulário de criação de clientes impede o envio sem nome e valida o tamanho máximo dos campos no servidor.
*   [ ] É possível pesquisar clientes por nome a partir da barra de busca principal.
*   [ ] A visualização detalhada do cliente mostra suas informações e carrega todas as consultas dele corretas.
*   [ ] As operações de criação, atualização e exclusão funcionam corretamente e refletem imediatamente no banco.
*   [ ] Se tentarmos deletar um cliente que possui histórico de consultas, o sistema mostra um erro tratável na tela e não deixa apagar.
*   [ ] Operações de banco de dados são protegidas por sessão ativa no middleware (redireciona para `/login` se tentar acessar sem estar logado).

---

## 6. Decisões Técnicas

### 6.1 Estado e Busca
*   Utilizaremos parâmetros de busca na URL (ex: `/dashboard?q=nome_pesquisado`).
*   **Motivo**: Mantém o estado da busca compartilhável (bookmarkable), amigável ao botão de voltar do navegador e permite que a busca seja realizada inteiramente no lado do servidor em Server Components.

### 6.2 Comunicação com Prisma
*   **Busca e Leitura (Read)**: Realizada através de queries diretas do Prisma dentro de **React Server Components (RSC)**. Isso reduz o javascript enviado ao cliente e acelera a renderização da página.
*   **Mutações (Write/Update/Delete)**: Implementadas em **Server Actions** em arquivos dedicados na pasta `app/actions/clients.ts` (ou semelhante). O formulário utiliza estas Actions nativamente, atualizando a página com `revalidatePath` para limpar caches de Server Components de forma otimizada.

### 6.3 Divisão de Componentes
*   **React Server Components (Páginas)**:
    *   `/dashboard`: Busca os clientes do banco usando o filtro `q` e renderiza a lista.
    *   `/dashboard/clients/new`: Renderiza o formulário de cadastro.
    *   `/dashboard/clients/[id]`: Busca os dados e consultas do cliente e os exibe.
    *   `/dashboard/clients/[id]/edit`: Busca os dados atuais do cliente para renderizar o formulário de edição.
*   **React Client Components (Interatividade)**:
    *   Inputs de formulários que necessitam de estados locais de validação imediata e feedback do usuário.
    *   Barra de pesquisa para atualizar o parâmetro `?q=` na URL conforme o usuário digita (utilizando `useRouter` e `usePathname`).

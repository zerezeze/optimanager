# Painel Inicial (Dashboard) e Melhorias de UX

## 1. Objetivo

Criar uma página inicial (landing page protegida) pós-login que centralize as principais métricas de operação da Ótica Everardo (OptiManager). A interface deve fornecer ao operador uma visão rápida do volume de trabalho (clientes e consultas), acesso a atalhos fundamentais e exibição de atividades recentes, agilizando o atendimento diário do estabelecimento.

---

## 2. Estrutura do Dashboard

O dashboard será localizado na rota protegida `/dashboard` e conterá três seções principais:

### 2.1 Métricas e Indicadores
*   **Total de Clientes**: Card destacando a quantidade acumulada de clientes no banco de dados.
*   **Total de Consultas**: Card destacando o número total de prontuários visuais registrados.

### 2.2 Atalhos de Acesso Rápido
Botões com destaque visual para acionamento imediato das ações mais comuns:
*   **Novo Cliente** (Direciona para `/clientes/novo`).
*   **Ver Clientes** (Direciona para `/clientes`).

### 2.3 Atividades Recentes (Atalhos de Trabalho)
Listas limitadas para acesso rápido aos cadastros mais recentes sem necessidade de busca:
*   **Últimos Clientes Cadastrados**: Exibição dos 5 clientes inseridos mais recentemente (Nome e Telefone), com link direto para o perfil de cada um.
*   **Consultas Recentes**: Exibição das 5 últimas consultas cadastradas (Data, Nome do Cliente e Valor), com link direto para os detalhes de cada consulta.

---

## 3. Navegação e Leiaute

### 3.1 Barra de Navegação Superior (Header Global)
Para garantir uma experiência de uso coesa, implementaremos um cabeçalho simples e elegante nas rotas protegidas (`/dashboard`, `/clientes` e `/consultas`), contendo:
*   **Logotipo/Nome do Sistema**: Clique direciona para `/dashboard`.
*   **Menu Principal**: Links rápidos para "Dashboard" e "Clientes".
*   **Perfil do Usuário**: E-mail do usuário autenticado exibido no canto superior direito.
*   **Logout**: Botão integrado de saída utilizando o `signOut` do Auth.js.

---

## 4. Melhorias de Experiência (UX)

### 4.1 Estados Vazios (Empty States)
*   Se o banco não possuir clientes ou consultas cadastradas, os blocos de "Atividades Recentes" devem exibir mensagens explicativas amigáveis (ex: *"Nenhum cliente cadastrado recentemente"* ou *"Nenhuma consulta registrada ainda"*), acompanhadas de um botão para induzir a ação (ex: *"Cadastrar Primeiro Cliente"*).

### 4.2 Estados de Carregamento (Loading States)
*   Criação de arquivos `loading.tsx` nativos do Next.js App Router para rotas demoradas, mostrando esqueletos de carregamento (skeletons) simples enquanto o banco de dados é consultado.

### 4.3 Mensagens de Feedback
*   Tratamento de erros de banco ou formulários com toasts ou banners de alerta vermelhos claros.
*   Feedback visual imediato (desabilitação de botões e texto alternado para "Salvando...") durante chamadas de Server Actions para evitar cliques duplicados.

---

## 5. Decisões Técnicas

### 5.1 Carga de Dados no Servidor (RSC)
*   A página `/dashboard` será um **React Server Component** responsável por carregar todas as informações simultaneamente no lado do servidor.
*   Para evitar consultas lentas sequenciais (bloqueio de thread), utilizaremos `Promise.all` para disparar as contagens e listagens de forma paralela no PostgreSQL:
    ```typescript
    // Queries filtradas pelo ID do usuário da sessão (Multi-Tenant)
    const [totalClientes, totalConsultas, ultimosClientes, consultasRecentes] = await Promise.all([
      prisma.client.count({ where: { userId: session.user.id } }),
      prisma.consultation.count({ where: { client: { userId: session.user.id } } }),
      prisma.client.findMany({ where: { userId: session.user.id }, take: 5, orderBy: { createdAt: "desc" } }),
      prisma.consultation.findMany({ where: { client: { userId: session.user.id } }, take: 5, orderBy: { data: "desc" }, include: { client: true } })
    ]);
    ```

### 5.2 Otimizações de Banco e Desempenho
*   **Limitação de registros (`take: 5`)**: Nunca buscaremos todas as linhas do banco de dados para renderizar painéis de atividade recente.
*   **Seleção seletiva (`select`/`include`)**: Traremos apenas as informações necessárias para renderizar a interface (reduzindo tráfego de dados na rede entre banco de dados e servidor do Next.js).

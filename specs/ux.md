# Refinamento de UX, Feedback e Padronização Visual

## 1. Objetivo

Melhorar a experiência de uso (UX), o feedback visual e a consistência estética do OptiManager para um padrão de mercado (SaaS moderno), garantindo acessibilidade, animações fluidas e navegação intuitiva sem alterar nenhuma regra de negócio.

---

## 2. Componentes e Funcionalidades de Experiência (UX)

### 2.1 Notificações com Sonner (Toasts)
*   **Ação**: Toda ação de criação, edição, exclusão, login, logout ou erro dispara uma notificação flutuante no canto superior direito.
*   **Padrão de Cores**:
    *   **Sucesso**: Verde (ex: "Cliente cadastrado com sucesso.").
    *   **Erro**: Vermelho (ex: "E-mail ou senha incorretos.").
*   **Tratamento de Fluxos**:
    *   **Redirecionamentos nativos**: Nos formulários (Client Components) com redirecionamento no servidor, capturamos o erro `NEXT_REDIRECT` gerado pelo Next.js para renderizar o toast de sucesso antes de liberar o redirecionamento.
    *   **Ações diretas**: Em operações de alteração ou exclusão direta, a Server Action retorna um objeto `{ success, error }` de status, permitindo ao componente Client renderizar o toast e redirecionar via `useRouter`.

### 2.2 Diálogos de Confirmação com Radix UI (ConfirmDialog)
*   **Ação**: Antes de efetuar qualquer exclusão de Cliente ou Consulta, o sistema intercepta o clique do usuário e exibe uma caixa de diálogo elegante e acessível.
*   **Especificações**:
    *   Desenvolvido com `@radix-ui/react-dialog` e `lucide-react`.
    *   Suporte completo a foco por teclado e navegação assistida (WAI-ARIA).
    *   Overlay desfocado (`backdrop-blur-sm`) e transições suaves de escala.

### 2.3 Skeletons de Carregamento
*   **Ação**: Substituição das mensagens de "Carregando..." estáticas por blocos de esqueleto estilizados com animação pulsante (`animate-pulse`).
*   **Páginas contempladas**:
    *   `/dashboard`: Esqueleto de cards de estatísticas, listas de clientes recentes e consultas recentes.
    *   `/clientes`: Esqueleto da tabela de listagem de clientes e formulário de busca.
    *   `/consultas/[id]`: Esqueleto dos cards de dados refrativos, comerciais, receita e dados financeiros.
    *   `/usuarios`: Esqueleto da tabela de gerenciamento de operadores.

### 2.4 Empty States Padronizados
*   **Ação**: Caso uma busca ou listagem não contenha registros, exibe-se uma ilustração limpa com um convite para ação (CTA).
*   **Mensagens mapeadas**:
    *   **Clientes (sem dados)**: "Nenhum cliente cadastrado ainda." com botão para cadastrar.
    *   **Clientes (busca vazia)**: "Nenhum cliente encontrado." com botão para limpar busca.
    *   **Consultas (perfil do cliente)**: "Nenhuma consulta cadastrada." com botão para nova consulta.
    *   **Usuários**: "Nenhum usuário cadastrado." com botão para novo usuário.

### 2.5 Estados de Carregamento nos Botões
*   **Ação**: Todos os botões de envio em formulários desabilitam seu estado (`disabled`) e mudam o rótulo de texto (ex: "Excluindo...", "Salvando...", "Entrando...") ao serem clicados, evitando cliques duplicados ou submissões fantasma.

---

## 3. Decisões de Design e Estilo (Design System)

1.  **Arredondamento e Espaçamento**: Padronização dos cantos das caixas de input, botões e cartões em `8px` (`border-radius: 8px`), alinhado aos padrões SaaS modernos.
2.  **Focus States**: Estados de foco mais suaves e profissionais no formulário (`focus-visible:ring-2 focus-visible:ring-blue-500` implícito por box-shadow suave de 3px).
3.  **Transições de Interface**: Aplicação de `transition-all duration-200` em todos os elementos interativos (botões, links e inputs) para garantir suavidade no hover e foco.

# Gestão Financeira e Parcelamentos

## 1. Objetivo

Controlar os pagamentos e fluxos financeiros das consultas realizadas na Ótica Everardo (OptiManager). A funcionalidade permite registrar o método e status do pagamento de cada consulta, além de gerar e gerenciar parcelas do crediário próprio (parcelamentos), oferecendo à administração uma visão consolidada de valores recebidos e valores em aberto no dashboard.

---

## 2. Dados Financeiros

Os dados financeiros estão estruturados de forma modular e integrada às consultas, utilizando as tabelas `Payment` e `Installment`:

### Enums
*   **Método de Pagamento (`PaymentMethod`)**: `DINHEIRO`, `PIX`, `CARTAO_CREDITO`, `CARTAO_DEBITO`, `CREDIARIO`.
*   **Status de Pagamento (`PaymentStatus`)**:
    *   `PAGO`: Venda quitada integralmente.
    *   `PENDENTE`: Nenhum pagamento recebido ainda.
    *   `PARCIAL`: Pagamento parcial efetuado (comum em crediários com entrada ou parcelas pendentes).

### Modelo `Payment` (Pagamento)
*   **Identificador Único (`id`)**: UUID (PK).
*   **Consulta Relacionada (`consultationId`)**: FK → `Consultation` (relação 1:1, única).
*   **Status (`status`)**: Estado atual (`PaymentStatus`).
*   **Método Principal (`method`)**: Método de pagamento (`PaymentMethod`).
*   **Total Pago (`totalPago`)**: Valor em centavos representando o valor de entrada (ou o total à vista).
*   **Campos de Auditoria**: `createdAt`, `updatedAt`.

### Modelo `Installment` (Parcela)
*   **Identificador Único (`id`)**: UUID (PK).
*   **Pagamento Relacionado (`paymentId`)**: FK → `Payment` (relação 1:N com deleção em cascata).
*   **Número (`numero`)**: Índice da parcela (ex: 1ª, 2ª, 3ª).
*   **Valor (`valor`)**: Valor da parcela em centavos.
*   **Vencimento (`vencimento`)**: Data limite para pagamento da parcela.
*   **Pago (`pago`)**: Flag booleano (`true` se quitada, `false` se aberta).
*   **Data de Pagamento (`paidAt`)**: Registro temporal de quando a parcela foi quitada.
*   **Campos de Auditoria**: `createdAt`, `updatedAt`.

---

## 3. Casos de Uso

### 3.1 Registrar Pagamento à Vista (Criação/Edição)
*   **Ação**: O operador preenche os dados comerciais da consulta e seleciona a opção "Registrar pagamento agora" escolhendo um método à vista (Dinheiro, PIX, Cartão).
*   **Fluxo**: Ao salvar, o sistema cria o registro `Payment` com status `PAGO` e o valor total é computado como pago. Nenhuma parcela é criada.

### 3.2 Registrar Pagamento Parcelado (Crediário)
*   **Ação**: O operador seleciona o método `CREDIARIO`, informa o número de parcelas (ex: 3x, 6x) e um valor opcional de entrada.
*   **Fluxo**: Ao salvar, o sistema calcula o valor restante, gera as parcelas (`Installment`) com vencimentos mensais consecutivos (de 30 em 30 dias) e distribui os centavos residuais na última parcela. A venda é gravada com status `PARCIAL` (se houver entrada) ou `PENDENTE` (sem entrada).

### 3.3 Marcar Parcela como Paga
*   **Ação**: Na visualização de detalhes da consulta, o operador clica em "Marcar como paga" na tabela de parcelas de uma venda no crediário.
*   **Fluxo**: O sistema marca a parcela individual como paga (`pago = true`, `paidAt = agora`). Se todas as parcelas forem pagas, o status geral do pagamento avança automaticamente para `PAGO`. Caso contrário, permanece `PARCIAL`.

### 3.4 Visualizar Situação Financeira (Consulta e Histórico)
*   **Ação**: Exibir feedback visual da saúde financeira de cada venda.
*   **Fluxo**:
    *   No histórico de consultas do perfil do cliente, exibe-se um badge colorido representativo (`PAGO` - verde, `PARCIAL` - amarelo, `PENDENTE` - vermelho).
    *   Nos detalhes da consulta, exibe-se o bloco completo de Situação Financeira detalhando: Método, Total Pago acumulado (`entrada + parcelas pagas`), Saldo Devedor restante e a lista de parcelas.

### 3.5 Exibir Valores em Aberto no Dashboard
*   **Ação**: Exibir para o operador/administrador o total de contas a receber.
*   **Fluxo**: O Dashboard faz um somatório de todas as parcelas não pagas (`pago: false`) pertencentes às consultas do tenant atual e plota um card de métrica de destaque.

---

## 4. Regras de Negócio

1. **Valores em Centavos**: Todo valor financeiro é convertido e armazenado em centavos (tipo `Int`) para evitar problemas matemáticos de ponto flutuante.
2. **Cálculo de Saldo Devedor**: O saldo devedor de uma consulta é calculado dinamicamente no frontend: `valorTotal - (entrada + soma das parcelas pagas)`.
3. **Imutabilidade da Entrada**: A ação de marcar parcela como paga não altera a coluna `totalPago` (entrada) do `Payment`, atualizando apenas o status e a data da parcela correspondente.
4. **Isolamento de Dados (Multi-Tenant)**: As queries financeiras são restritas estritamente aos clientes do usuário logado. A action `markInstallmentPaid` valida a posse da consulta no servidor antes de executar a mutação.
5. **NEXT_REDIRECT Tratado**: As submissões do formulário financeiro re-lançam os erros de redirecionamento nativos do Next.js para evitar mensagens de erro desnecessárias ao operador.

---

## 5. Critérios de Aceitação

*   [ ] O operador pode escolher se deseja ou não cadastrar dados financeiros na criação/edição da consulta.
*   [ ] Ao selecionar crediário, as datas de vencimento são geradas a cada 30 dias de forma sequencial.
*   [ ] Os badges de status financeiro refletem fielmente as cores configuradas (verde, amarelo, vermelho).
*   [ ] Marcar parcelas individuais como pagas atualiza o saldo devedor e o status geral da consulta em tempo real.
*   [ ] Operadores não podem ver ou alterar dados financeiros de consultas de outras óticas.
*   [ ] O dashboard consolida os valores em aberto respeitando o isolamento do tenant.

---

## 6. Decisões Técnicas

### 6.1 Estrutura de Componentes
*   `PaymentFormFields.tsx` (Client Component): Fornece a interface dinâmica para seleção de método, preenchimento de entrada e parcelamento.
*   `PaymentStatusBadge.tsx` (Client Component): Formata e renderiza o badge colorido de status.
*   `InstallmentsTable.tsx` (Client Component): Apresenta as parcelas de forma tabular e dispara a Server Action de quitação com estados de carregamento via `useTransition`.

### 6.2 Mutação no Banco (Prisma Transactions)
A criação do registro de consulta e seu pagamento associado ocorre de forma atômica no banco por meio de `prisma.$transaction`. Se a criação das parcelas falhar, a consulta não é criada, garantindo a consistência das informações.

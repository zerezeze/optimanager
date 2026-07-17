# Impressão de Vias e Geração de PDF da Receita

## 1. Objetivo

Fornecer mecanismos profissionais de documentação para a ótica e os clientes:
1.  **Impressão Otimizada (Ficha de Laboratório e Recibo)**: Estilos CSS de impressão sob demanda para separar vias clínicas e comerciais.
2.  **Geração de PDF da Receita**: Download local de um documento vetorial, limpo, focado nos dados refrativos do paciente e livre de informações de pagamento.

---

## 2. Decisões Técnicas

### 2.1 CSS `@media print` no [globals.css](file:///Users/zerezeze/otica-everardo/app/globals.css)
*   **Ocultação Automática**: Elementos como o header de navegação do app, barra lateral, botões de ação e modais são suprimidos (`display: none !important`) por padrão ao acionar o diálogo de impressão.
*   **Impressão Condicional**:
    *   **Ficha de Laboratório** (`body.print-lab-only`): Oculta a seção financeira (`.print-section-financial`).
    *   **Recibo Comercial** (`body.print-receipt-only`): Oculta a seção clínica de graus refrativos (`.print-section-refractive`).

### 2.2 Geração de PDF com `@react-pdf/renderer`
*   **Isolamento e Segurança de Dados**: O componente [PrescriptionPdfDocument.tsx](file:///Users/zerezeze/otica-everardo/components/PrescriptionPdfDocument.tsx) utiliza a interface estrita `PrescriptionPdfData`. Ele **não** recebe o objeto completo de consulta e **não** possui propriedades relacionadas a valores, parcelas ou métodos de pagamento.
*   **Carregamento Dinâmico no Clique (Lazy Load)**: Em vez de importar a biblioteca `@react-pdf/renderer` no nível do módulo (o que aumenta o bundle inicial e causa avisos de compilação em NodeJS no servidor), importamos a biblioteca dinamicamente no momento do clique do usuário (`await import("@react-pdf/renderer")`).
*   **Sanitização de Nome**: O arquivo gerado remove caracteres especiais e acentos do nome do cliente, substituindo espaços por sublinhados (`_`), por exemplo: `Receita_Joao_Silva.pdf`.

---

## 3. Casos de Uso e Fluxos

### 3.1 Imprimir Recibo
*   **Ação**: O operador clica em "Imprimir Recibo" na barra de ações.
*   **Comportamento**: A classe `print-receipt-only` é aplicada temporariamente no `body` e o navegador abre a pré-visualização de impressão. O papel exibe apenas dados comerciais, parcelas e dados de identificação.

### 3.2 Imprimir Ficha de Laboratório
*   **Ação**: O operador clica em "Imprimir Ficha de Laboratório".
*   **Comportamento**: A classe `print-lab-only` é aplicada temporariamente no `body` e o navegador abre a pré-visualização de impressão contendo apenas a receita e as observações clínicas.

### 3.3 Gerar PDF da Receita
*   **Ação**: O operador clica em "Gerar PDF da Receita".
*   **Comportamento**:
    1. O botão exibe o estado de carregamento `"Gerando PDF..."` e é desabilitado para evitar cliques repetidos.
    2. O PDF é construído sob o padrão A4 em memória.
    3. O download é disparado no navegador com o nome sanitizado.
    4. Um toast de sucesso é exibido e o botão retorna ao estado original.

---

## 4. Critérios de Aceitação

*   [ ] O PDF gerado não deve conter nenhuma menção a valores, meios de pagamento ou parcelas.
*   [ ] Os botões de impressão e PDF não aparecem na visualização final impressa ou no arquivo PDF.
*   [ ] O nome do arquivo gerado deve estar sanitizado.
*   [ ] O projeto deve compilar completamente sem erros de compilação no build de produção.

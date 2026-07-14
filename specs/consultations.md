# Gestão de Consultas Oftalmológicas

## 1. Objetivo

Gerenciar e armazenar o histórico de exames refrativos e dados comerciais (receituários de óculos) dos clientes da Ótica Everardo. A funcionalidade é essencial para manter a rastreabilidade da evolução da visão de cada cliente ao longo do tempo e subsidiar a confecção de suas lentes.

---

## 2. Modelo de Dados (Campos)

Cada consulta é representada no banco de dados com os seguintes campos:

*   **Identificador Único (`id`)**: UUID gerado de forma randômica e segura.
*   **Cliente Vinculado (`client_id`)**: ID (UUID) do cliente proprietário da consulta (estritamente obrigatório).
*   **Data da Consulta (`data`)**: Data do exame (padrão: data/hora de criação, editável).
*   **Campos de Refração Específicos (Novos)**:
    *   **Olho Direito (OD)**: `odEsferico`, `odCilindrico`, `odEixo`, `odDnp`, `odAltura`.
    *   **Olho Esquerdo (OE)**: `oeEsferico`, `oeCilindrico`, `oeEixo`, `oeDnp`, `oeAltura`.
    *   *Nota*: Os campos unificados legados (`olho_direito` e `olho_esquerdo`) foram mantidos provisoriamente no banco para retrocompatibilidade durante a transição.
*   **Adição (`adicao`)**: Grau de adição para perto (String opcional, máx 50 caracteres).
*   **Lentes (`lentes`)**: Tipo de lente prescrita/vendida (String opcional, máx 255 caracteres).
*   **Laboratório (`laboratorio`)**: Nome do laboratório óptico parceiro (String opcional, máx 255 caracteres).
*   **Valor (`valor`)**: Valor comercial da consulta ou pacote, armazenado como Inteiro em centavos (obrigatório).
*   **Observação (`observacao`)**: Observações clínicas ou comerciais adicionais (Text opcional).
*   **Campos de Auditoria**:
    *   `createdAt`: Data e hora da criação do registro.
    *   `updatedAt`: Data e hora da última modificação.

---

## 3. Casos de Uso

### 3.1 Criar Nova Consulta para um Cliente
*   **Ação**: A partir da visualização de detalhes de um cliente, o operador clica em "Nova Consulta".
*   **Fluxo**: É exibido um formulário pré-associado ao cliente. O operador preenche os campos refrativos (olhos direito/esquerdo, adição), comerciais (lentes, laboratório, valor em formato decimal convertido para centavos no envio) e observações. Ao salvar, a consulta é registrada.

### 3.2 Visualizar Histórico de Consultas
*   **Ação**: Acessar o prontuário visual do cliente.
*   **Fluxo**: Exibido diretamente na página de detalhes do cliente (`/clientes/[id]`), listando todas as consultas associadas de forma decrescente (da mais recente para a mais antiga).

### 3.3 Visualizar Detalhes de uma Consulta
*   **Ação**: Acessar a ficha completa de uma consulta específica.
*   **Fluxo**: O operador clica sobre a consulta no histórico do cliente e é direcionado para uma página detalhada contendo todas as especificações do receituário.

### 3.4 Editar uma Consulta
*   **Ação**: Corrigir informações preenchidas incorretamente em uma consulta cadastrada.
*   **Fluxo**: O operador clica em "Editar" na página da consulta, atualiza os campos necessários (com formato tabular de receita) e salva. O registro é atualizado no banco.

### 3.5 Excluir uma Consulta
*   **Ação**: Remover permanentemente uma consulta do histórico do cliente.
*   **Fluxo**: O operador clica no botão "Excluir Consulta", confirma a caixa de diálogo de segurança e a exclusão é efetuada, retornando ao perfil do cliente.

---

## 4. Regras de Negócio

1.  **Integridade Referencial**: Toda consulta deve pertencer obrigatoriamente a um cliente válido no sistema. É impossível criar uma consulta sem vinculação.
2.  **Relação Um-para-Muitos**: Um cliente pode ter histórico ilimitado de consultas, permitindo o acompanhamento anual de sua visão.
3.  **Não Sobrescrita (Histórico Imutável por padrão)**: A criação de uma nova receita deve gerar um novo registro em vez de atualizar a consulta anterior do cliente, preservando o histórico clínico.
4.  **Valor em Centavos**: O valor financeiro da consulta deve ser inserido em formato legível (ex: `150,00`) mas persistido como centavos (`15000`) para evitar erros de arredondamento.
5.  **Data Padrão**: A data da consulta assume o momento da criação do registro caso não seja especificada manualmente pelo operador.

---

## 5. Critérios de Aceitação

A funcionalidade será considerada concluída se atender aos seguintes requisitos:
*   [ ] É possível cadastrar uma nova consulta a partir do perfil de um cliente específico.
*   [ ] O formulário de consulta exige preenchimento do valor (inteiro ou convertido) e valida o tamanho máximo dos campos textuais.
*   [ ] As consultas cadastradas aparecem na página de detalhes do cliente ordenadas pela data mais recente.
*   [ ] É possível clicar em uma consulta da lista para ver todas as suas informações detalhadas.
*   [ ] As consultas podem ser editadas com sucesso e as alterações são mostradas imediatamente.
*   [ ] Operações de criação e edição são protegidas por autenticação no middleware.

---

## 6. Decisões Técnicas

### 6.1 Estrutura de Rotas e Páginas
Para manter a simplicidade arquitetural e evitar sobreposição de layouts:
*   `/clientes/[id]`: React Server Component que, além dos dados do cliente, faz uma busca pelas consultas associadas (`prisma.consultation.findMany` filtrando por `clientId`) e renderiza o histórico.
*   `/clientes/[id]/consultas/nova`: Formulário de criação de consulta associado a um cliente.
*   `/consultas/[id]`: Visualização detalhada de uma consulta individual.
*   `/consultas/[id]/editar`: Formulário para edição dos dados da consulta.

### 6.2 Relacionamento Client -> Consultation
*   Representado no banco de dados via chave estrangeira `client_id` na tabela `consultations` apontando para a chave primária `id` em `clients` (com comportamento `onDelete: Restrict`).

### 6.3 Buscas Prisma
*   **Leitura**: As consultas de um cliente serão recuperadas ordenadas de forma decrescente pela coluna `data`:
    ```typescript
    prisma.consultation.findMany({
      where: { clientId },
      orderBy: { data: "desc" }
    })
    ```
*   **Índices**: Utilizaremos o índice de busca criado na coluna `data` da tabela `consultations` para otimizar a ordenação temporal das listas.

### 6.4 Divisão de Responsabilidades
*   **React Server Components (RSC)**: Responsáveis por buscar as consultas no banco (ex: listagem no perfil do cliente, carregamento dos dados originais para a visualização detalhada ou formulário de edição).
*   **Server Actions**: Localizadas em `app/actions/consultations.ts`. Mutações como `createConsultation` e `updateConsultation` validam os dados recebidos com **Zod**, convertem o valor decimal para centavos (`Int`), salvam os dados no Prisma e usam `revalidatePath` para invalidar o cache da página do cliente correspondente.

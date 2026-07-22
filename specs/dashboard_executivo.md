# Especificação Técnica: Dashboard Executivo (Sprint 18)

## 1. Objetivo
Transformar a tela inicial interna (/dashboard) do OptiManager em um painel executivo gerencial completo e moderno. O painel unifica métricas de cadastros, atendimentos operacionais, faturamento bruto e gráficos de tendência histórica em uma interface responsiva, respeitando estritamente a arquitetura de isolamento de dados (Multi-Tenant).

---

## 2. Indicadores e Métricas

O dashboard calcula e exibe três conjuntos de indicadores no lado do servidor:

### 2.1 Cards de Métricas Principais
*   **Total de Clientes**: Quantidade de novos clientes cadastrados no período selecionado.
*   **Total de Consultas**: Quantidade de consultas médicas/exames realizados no período selecionado.
*   **Receita Total**: Somatório das receitas brutas das consultas ocorridas no período selecionado.
*   **Ticket Médio**: Média aritmética de faturamento por consulta ocorrida no período (`Receita Total / Total de Consultas`).

### 2.2 Indicadores Operacionais de Atendimento
Cards menores contendo contagens absolutas para controle diário de volume de trabalho (períodos fixos):
*   **Consultas Hoje**: Exames agendados/realizados a partir de `00:00:00` do dia corrente.
*   **Consultas esta Semana**: Exames a partir de segunda-feira da semana corrente.
*   **Consultas este Mês**: Exames a partir do dia 1 do mês corrente.
*   **Clientes no Mês**: Novos cadastros de clientes a partir do dia 1 do mês corrente.

### 2.3 Resumo Financeiro
Histórico consolidado acumulado por períodos de controle da ótica:
*   **Receita Hoje**: Faturamento gerado no dia corrente.
*   **Receita do Mês**: Faturamento acumulado no mês corrente.
*   **Receita do Ano**: Faturamento acumulado no ano corrente.

---

## 3. Visualizações Gráficas (Recharts)

Para apoiar a tomada de decisão gerencial, implementamos 4 gráficos responsivos em SVG utilizando a biblioteca **Recharts**:
*   **Faturamento Mensal (AreaChart)**: Curva de tendência da receita bruta (em BRL convertida para inteiro) nos últimos 12 meses, preenchendo meses sem vendas com valor zero.
*   **Novos Clientes (BarChart)**: Gráfico de colunas exibindo o volume de novos cadastros de clientes por mês.
*   **Volume de Consultas (LineChart)**: Gráfico de linha que demonstra a flutuação mensal de atendimentos refrativos.
*   **Laboratórios Mais Utilizados (BarChart Vertical)**: Gráfico horizontal exibindo a contagem absoluta de ordens de serviço direcionadas a cada laboratório parceiro no período selecionado.

---

## 4. Filtro Global de Período

No topo da página, um seletor de período (`DateRangeFilter`) permite ao usuário filtrar todo o escopo do dashboard:
*   **Opções**: *Hoje*, *Últimos 7 dias*, *Últimos 30 dias*, *Últimos 90 dias* e *Este Ano*.
*   **Funcionamento**: A alteração recarrega a página injetando o parâmetro de query `?range=[opcao]` na URL. O Next.js Server Component intercepta a alteração e recalcula instantaneamente todas as contagens e gráficos.

---

## 5. Arquitetura e Performance (RSC & Multi-Tenant)

*   **Busca no Servidor**: Toda a agregação de dados é executada diretamente no PostgreSQL via Prisma no lado do servidor.
*   **Operações Agregadas**: Evitamos carregar registros pesados ou loops de contagem no servidor Node/Edge. Métricas utilizam `prisma.client.count`, `prisma.consultation.count`, `prisma.consultation.aggregate` (`_sum`) e `prisma.consultation.groupBy` de forma otimizada em paralelo (`Promise.all`).
*   **Segurança Multi-Tenant**:
    *   **Administradores**: Acessam métricas globais e agrupadas de toda a aplicação (onde `where` é vazio).
    *   **Operadores**: Visualizam estritamente as métricas geradas por seus próprios clientes (`userId: sessionUser.id`) e consultas associadas, prevenindo acessos a dados de outras óticas.

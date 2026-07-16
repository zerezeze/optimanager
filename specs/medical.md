# Médico Prescritor na Consulta

## 1. Objetivo

Permitir o registro do Médico Prescritor (oftalmologista/optometrista) que realizou a prescrição da receita óptica de cada consulta no OptiManager. O médico pertence diretamente ao escopo da consulta, garantindo consistência histórica e permitindo que o mesmo cliente consulte profissionais diferentes em momentos distintos no tempo.

---

## 2. Dados do Banco

Adicionamos suporte ao campo `medico` no modelo `Consultation`:

### Modelo `Consultation` (Consulta)
*   **Médico (`medico`)**: `String?` com limite de 255 caracteres (`@db.VarChar(255)`). Mapeado para `medico` na tabela.
*   **Índice de Pesquisa**: Adicionamos `@@index([medico])` para otimizar futuras pesquisas por médicos parceiros e filtros de relatórios.

---

## 3. Casos de Uso

### 3.1 Registrar Médico na Criação (Cadastro)
*   **Ação**: O operador preenche os Dados Comerciais no formulário de criação (seja na primeira consulta ao criar um cliente, ou em consultas subsequentes).
*   **Fluxo**: O sistema lê o campo `medico` (String limpa via trim), valida os limites e grava no banco de dados.

### 3.2 Visualizar Médico e Organização Visual
*   **Ação**: Exibir na ficha da consulta (/consultas/[id]) o Médico de forma destacada, separando dados clínicos de dados comerciais.
*   **Ordem Visual Adotada**:
  1. 👨‍⚕️ Médico (`medico`)
  2. 📅 Data da Consulta (`data`)
  3. 🏭 Laboratório (`laboratorio`)
  4. 👓 Lentes (`lentes`)
  5. 💰 Valor (`valor`)
  6. 📝 Observações (`observacao`)
  7. 📄 Ordem de Serviço (`ordemServico`)
*   **Valor Padrão**: Caso não informado, exibe "Não informado".

---

## 4. Regras de Negócio

1. **Opcionalidade**: O preenchimento do campo é totalmente opcional, garantindo compatibilidade total com consultas antigas.
2. **Sanitização (Trim)**: Espaços em branco no início ou final do texto do médico são limpos antes de validar com o Zod.
3. **Limitação de Tamanho**: Máximo de 255 caracteres.
4. **Isolamento de Listagens**: O nome do médico é exibido apenas na ficha completa de visualização da consulta e no formulário de edição, não sendo necessário poluir listas resumidas.

---

## 5. Critérios de Aceitação

*   [ ] O operador pode opcionalmente informar o nome do Médico ao cadastrar/editar.
*   [ ] O nome do médico aparece na ficha de detalhes seguindo a ordem visual clínica/comercial especificada.
*   [ ] Consultas anteriores continuam funcionando normalmente exibindo "Não informado".
*   [ ] O banco de dados possui o índice `consultations_medico_idx`.

---

## 6. Decisões Técnicas

### 6.1 Preparação para Evolução Futura
Decidimos manter o campo como `String?` nesta sprint para atender ao requisito de simplicidade e rapidez de entrega. No entanto, estruturamos a Server Action e o Prisma Client com a coluna `medico` isolada, de forma que em uma sprint futura possamos substituir o campo por uma tabela de relacionamento `@relation` com uma nova entidade `Medico` com mínimo impacto nas camadas de roteamento e visualização.

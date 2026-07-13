# Deploy e Ambiente de Produção

## 1. Objetivo

Definir e documentar as diretrizes, infraestrutura, listas de checagem e o processo necessário para publicar o sistema OptiManager (Ótica Everardo) em um ambiente de produção seguro, performático e escalável.

---

## 2. Infraestrutura e Hospedagem

### 2.1 Hospedagem da Aplicação
*   **Plataforma**: **Vercel**
*   **Motivo**: Integração nativa com o Next.js App Router, compilação otimizada de Server Components, suporte automático para Server Actions e hospedagem facilitada com certificados SSL inclusos.

### 2.2 Banco de Dados em Produção
*   **Provedor**: **PostgreSQL Gerenciado** (Neon ou Supabase)
*   **Conexão segura**: A string de conexão (`DATABASE_URL`) deve obrigatoriamente exigir conexão segura (SSL) através do parâmetro `?sslmode=require`.

### 2.3 Gerenciamento de Variáveis de Ambiente
*   Todas as credenciais sensíveis devem ser configuradas diretamente nas configurações de variáveis de ambiente da Vercel (Environment Variables Settings).
*   **Nunca** commite arquivos `.env` ou chaves de produção no repositório Git. O arquivo `.gitignore` do projeto já está configurado para evitar isso.

---

## 3. Gerenciamento do Banco de Dados

### 3.1 Fluxo de Aplicação de Mudanças
O gerenciamento do banco de dados em produção deve seguir rigorosamente as etapas abaixo, garantindo a separação entre a estrutura das tabelas e a população de dados:

1.  **Deploy da Aplicação**: A Vercel compila o sistema e sobe a nova versão.
2.  **Aplicação de Migrações (Automático ou Manual)**:
    ```bash
    npx prisma migrate deploy
    ```
    Este comando lê a pasta `prisma/migrations`, compara com as migrações aplicadas no banco de produção e executa os arquivos SQL novos de forma transacional e segura, sem resetar tabelas existentes.
3.  **Execução do Seed (Manual)**:
    ```bash
    npx prisma db seed
    ```
    **Atenção**: O seed não deve ser executado automaticamente durante as esteiras normais de build/deploy. O operador deve executá-lo manualmente apenas quando necessário (ex: primeira instalação do sistema) para evitar cargas indesejadas de dados.

---

## 4. Checklist Pré-Produção (Homologação)

Antes de iniciar a publicação oficial da aplicação, o operador deve confirmar os seguintes pontos de segurança e funcionamento:
*   [ ] **Testar Migrations em Banco Vazio**: Criar um banco de dados PostgreSQL temporário vazio e rodar as migrações locais para garantir que a DDL do SQL compilado e os índices são criados sem erros de sintaxe.
*   [ ] **Validar Conexão com o Banco de Produção**: Testar localmente a conexão com a URL de produção (utilizando ferramentas como `pgAdmin`, `DBeaver` ou um script simples de conexão) para garantir que a porta está liberada e o SSL (`?sslmode=require`) está funcional.
*   [ ] **Confirmar Idempotência do Seed**: Executar o comando `npx prisma db seed` seguidas vezes no ambiente de testes e validar se os dados não se duplicam ou causam conflito de chaves primárias.
*   [ ] **Confirmar que Secrets não estão no Repositório**: Rodar `git status` e verificar o histórico do Git para garantir que chaves privadas (`AUTH_SECRET`), credenciais reais de banco e arquivos `.env` não foram adicionados acidentalmente ao Git.

---

## 5. Fluxo de Build e Deploy

### 5.1 Processo de Build
O comando executado na esteira de deploy para compilar o sistema é:
```bash
npm run build
```

### 5.2 Variáveis de Ambiente Obrigatórias em Produção
Definir no painel da Vercel:

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `DATABASE_URL` | String de conexão segura com o PostgreSQL de produção. | `postgresql://user:password@ep-db-name.neon.tech/dbname?sslmode=require` |
| `AUTH_SECRET` | Chave de 32 caracteres (base64) para criptografar cookies de sessão. | `openssl rand -base64 32` (gerado localmente) |
| `NEXTAUTH_URL` | URL base do sistema em produção (opcional na Vercel, mas recomendado). | `https://optimanager-everardo.vercel.app` |

---

## 6. Checklist de Validação em Produção

Após concluir o deploy, execute os seguintes testes manuais na URL pública de produção:
- [ ] **Login**: Confirmar que o e-mail `admin@optimanager.com` e a senha definida no seed permitem logar com sucesso.
- [ ] **Proteção de Rotas**: Acessar a URL `/dashboard`, `/clientes` ou `/consultas` em uma aba anônima (deslogado) e confirmar que o sistema bloqueia e redireciona para `/login`.
- [ ] **Cadastro de Cliente**: Acessar `/clientes/novo`, preencher os dados de um cliente de teste e confirmar o salvamento.
- [ ] **Busca de Cliente**: Digitar o nome do cliente de teste no campo de busca e confirmar que o filtro funciona na tabela.
- [ ] **Criação de Consulta**: Clicar em "+ Nova Consulta" no perfil do cliente cadastrado, preencher com valores (ex: `150,00`) e confirmar que o valor é salvo corretamente e a tabela exibe `R$ 150,00`.
- [ ] **Dashboard**: Validar que a contagem de clientes e consultas no painel inicial foi incrementada e as atividades recentes exibem os novos registros.

---

## 7. Boas Práticas de Segurança

1.  **Exposição de Secrets**: Nunca adicione arquivos `.env` ou `.env.local` no Git. Sempre utilize as configurações oficiais da plataforma de hospedagem.
2.  **Segurança das Senhas**: A senha do usuário inicial seedada em produção deve ser alterada pelo painel administrativo imediatamente após o primeiro login para evitar uso de credenciais padrão (`123456`).

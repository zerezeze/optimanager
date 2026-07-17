# Integração e Comunicação via WhatsApp

## 1. Objetivo

Facilitar a comunicação direta entre a ótica e os clientes, agilizando tarefas comuns do dia a dia como:
*   Iniciar uma conversa rápida pelo perfil do cliente.
*   Notificar que os óculos da Ordem de Serviço (O.S.) estão prontos para retirada.
*   Enviar cobranças rápidas e cordiais para parcelas pendentes (crediário próprio).

---

## 2. Decisões Técnicas e Utilitários

### 2.1 Formatação do Link (`lib/whatsapp.ts`)
Criamos um utilitário centralizado [whatsapp.ts](file:///Users/zerezeze/otica-everardo/lib/whatsapp.ts) para:
*   Sanitizar a string do telefone (removendo parênteses, traços e espaços via regex `/\D/g`).
*   Garantir a inclusão do DDI do Brasil (`55`) caso o número cadastrado contenha apenas o DDD + número.
*   Codificar adequadamente o texto da mensagem (`encodeURIComponent`) para evitar quebras em caracteres especiais e acentos.

---

## 3. Casos de Uso e Atalhos Implementados

### 3.1 Conversa Rápida no Perfil do Cliente (`/clientes/[id]`)
*   **Localização**: Ao lado do número de telefone no perfil do cliente.
*   **Comportamento**: Se o telefone estiver preenchido, renderiza um link verde "WhatsApp" com o ícone `MessageCircle`. Abre uma conversa simples pré-iniciada.

### 3.2 Alerta de O.S. Pronta (`/consultas/[id]`)
*   **Localização**: Dentro do card "Ordem de Serviço" na ficha detalhada da consulta.
*   **Mensagem disparada**:
    > *"Olá {Nome do Cliente}, seus óculos da O.S. {Número da O.S.} já estão prontos na Ótica Everardo! Pode vir buscar."*

### 3.3 Cobrança de Carnê / Parcela Pendente (`/consultas/[id]`)
*   **Localização**: Ao lado do botão de dar baixa em cada parcela na tabela de crediário ([InstallmentsTable](file:///Users/zerezeze/otica-everardo/components/InstallmentsTable.tsx)).
*   **Mensagem disparada**:
    > *"Olá {Nome do Cliente}, lembramos que sua {N}ª parcela no valor de {Valor} vence em {Data de Vencimento}."*

---

## 4. Critérios de Aceitação

*   [ ] O link de WhatsApp só deve ser visível se o cliente possuir telefone cadastrado.
*   [ ] O telefone do cliente deve ser sanitizado corretamente removendo caracteres especiais.
*   [ ] Ao clicar no link, o navegador deve abrir uma nova aba (`_blank`) apontando para `https://wa.me/` com os parâmetros do número e texto codificados.
*   [ ] O sistema deve compilar perfeitamente com TypeScript sem erros de tipagem.

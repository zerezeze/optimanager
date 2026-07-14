# Banco de Dados

## User (Novo)

- id (UUID)
- name (VarChar)
- email (VarChar)
- password (VarChar)
- role (UserRole: ADMIN, OPERATOR)
- createdAt, updatedAt

## Client

- id (UUID)
- nome (VarChar)
- endereco (VarChar)
- telefone (VarChar)
- userId (Fk para User)
- createdAt, updatedAt

## Consultation

- id (UUID)
- clientId (Fk para Client)
- olhoDireito (Legado - VarChar)
- olhoEsquerdo (Legado - VarChar)
- odEsferico, odCilindrico, odEixo, odDnp, odAltura (Campos de Refração OD)
- oeEsferico, oeCilindrico, oeEixo, oeDnp, oeAltura (Campos de Refração OE)
- adicao (VarChar)
- lentes (VarChar)
- laboratorio (VarChar)
- ordemServico (VarChar - Novo)
- valor (Int - centavos)
- observacao (Text)
- data (DateTime)
- createdAt, updatedAt

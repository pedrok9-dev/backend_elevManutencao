# ElevManutenção — Backend (API)

API do e-commerce ElevManutenção (Node.js + Express + Sequelize + MySQL). Roda em **http://localhost:3000**.

O frontend fica em outro repositório/pasta (`front_elevManutencao`) e conversa com esta API.

## Requisitos

- Node.js
- MySQL ligado (Workbench ou XAMPP)

## Como rodar

1. Confira usuário e senha do MySQL em `src/config/ambiente.js` (host, usuário e senha).
2. No terminal, dentro desta pasta:

```
npm install
npm start
```

O banco `db_elevmanutencao` e as tabelas são criados automaticamente. Deixe esse terminal aberto.

3. Em **outro terminal**, também dentro desta pasta, popule o banco (admin, 6 categorias, 30 produtos e 3 kits com imagens):

```
npm run seed
```

Login do admin: `admin@elevmanutencao.com.br` / `admin123`

4. Para ver a loja, abra o frontend (veja o README do `front_elevManutencao`).

## Comandos

| Comando | O que faz |
|---|---|
| `npm start` | Sobe a API em localhost:3000 |
| `npm run seed` | Cria admin, categorias, produtos, kits e aplica as imagens de `imagens-seed` |
| `npm run exportar-imagens` | Copia as imagens cadastradas pelo painel para `imagens-seed` (com o nome certo) |
| `npm run sync` | Recria todas as tabelas do zero (**apaga os dados**) |

## Pastas importantes

- `uploads/` — imagens de produtos e kits (a API serve em `http://localhost:3000/uploads/...`).
- `imagens-seed/` — imagens que o `npm run seed` usa. Produto: nome do arquivo = código interno (ex: `EM-C25.png`). Kit: nome do kit sem acento e com hífens (ex: `kit-eletrica-basica.jpg`).
- `src/` — routes, controllers, services, models, utils (validações de CPF, CNPJ e CEP), db e config.

## Observações

- Quem clonar este repositório precisa do próprio MySQL local. Os dados ficam no banco de cada PC.
- A API já aceita requisições de outros endereços (CORS liberado), por isso o frontend pode estar no Vercel, no Live Server ou em qualquer outro lugar.

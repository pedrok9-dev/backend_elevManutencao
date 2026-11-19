# ElevManutenção — Front + Back juntos (localhost)

Projeto unificado em duas pastas: `backend/` (API) e `frontend/` (páginas). O Express do backend também serve o frontend, então tudo roda na mesma porta.

## Como rodar

1. Abra o MySQL Workbench e deixe o servidor MySQL local ligado.
2. Confira usuário e senha do MySQL em `backend/src/config/ambiente.js` (padrão: usuário `root`, senha `root`). Se a sua senha for outra, troque lá.
3. No terminal, entre na pasta do backend:

```
cd backend
npm install
npm start
```

O banco `db_elevmanutencao` e as 12 tabelas são criados automaticamente.

4. (Opcional) Em outro terminal, também dentro de `backend/`, para popular com dados de exemplo (admin, categorias, produtos, kits):

```
npm run seed
```

5. Acesse: http://localhost:3000

Login de teste (depois do seed): `admin@elevmanutencao.com.br` / `admin123`

## Observações

- A consulta de CEP usa a API ViaCEP, então precisa de internet. As validações de CPF/CNPJ/CEP do backend continuam as mesmas.
- As fontes (Google Fonts) e o Chart.js dos relatórios também vêm da internet, como no projeto original.
- `npm run sync` recria todas as tabelas do zero (apaga os dados).

## Estrutura

```
elevManutencao/
├─ backend/
│  ├─ index.js, sync.js, seed.js, package.json
│  └─ src/   (routes, controllers, services, models, utils, db, config)
└─ frontend/
   ├─ index.html
   ├─ pages/  admin/  assets/
```

# ElevManutenção — Backend (API)

E-commerce B2B de peças, ferramentas e kits para manutenção de elevadores.
API REST em Node.js + Express + Sequelize + MySQL, com **12 tabelas** relacionais.

Este pacote já vem pronto para publicar direto no **Railway** — sem passos de
ambiente local. Siga a ordem abaixo.

---

## 🔧 PASSO A PASSO NO RAILWAY

### 1) Crie o banco de dados
No seu projeto Railway: **+ New → Database → Add MySQL**.

### 2) Suba este código como um serviço
**+ New → GitHub Repo** (suba esta pasta para um repositório) ou **+ New → Empty Service**
e faça upload/deploy manual. Aponte a raiz do serviço para esta pasta (`elevmanutencao-backend`).

### 3) Ligue o serviço ao banco (aba **Variables**)
No serviço do backend → **Variables** → **+ New Variable** → **Add Reference** →
escolha o serviço **MySQL** → selecione `DATABASE_URL`.
O Railway preenche sozinho algo como:
```
DATABASE_URL=${{MySQL.DATABASE_URL}}
```
👉 **Não digite essa URL na mão** — sempre use "Add Reference", assim ela se atualiza sozinha.

### 4) Adicione as demais variáveis (ainda na aba Variables)
```
NODE_ENV=production
PORT=3000
JWT_SECRET=troque_esta_chave_por_uma_bem_grande_e_aleatoria
JWT_EXPIRES_IN=8h
BCRYPT_SALT_ROUNDS=10
CORS_ORIGIN=*
```
(veja `.env_exemplo` para a lista completa comentada)

### 5) Crie as 12 tabelas
Em **Settings → Deploy → Pre-Deploy Command**, coloque:
```
npm run sync
```
Isso roda **uma vez** antes de cada deploy e (re)cria as tabelas.
⚠️ Ele usa `{ force: true }` — apaga e recria tudo. Depois do primeiro deploy
funcionando, se não quiser mais apagar dados a cada novo deploy, pode limpar
esse campo (deixar em branco).

### 6) (Opcional) Popule com dados de exemplo
Pela aba **Shell** do serviço no Railway (ou reaproveitando o Pre-Deploy Command
uma única vez), rode:
```
npm run seed
```
Isso cria um usuário admin de teste:
- **E-mail:** admin@elevmanutencao.com.br
- **Senha:** admin123

### 7) Gere o domínio público
Em **Settings → Networking → Generate Domain**. Copie essa URL — é ela que
você vai colar no `assets/js/config.js` do **frontend**.

---

## As 12 tabelas

| # | Tabela | Papel |
|---|---|---|
| 1 | Usuario | Conta do cliente/admin e credenciais |
| 2 | Endereco | Endereços do usuário (entrega) |
| 3 | Categoria | Organização dos produtos por área |
| 4 | Fornecedor | Empresas que fornecem peças |
| 5 | Produto | Itens vendidos na loja |
| 6 | Estoque | Saldo atual e mínimo por produto (1:1) |
| 7 | MovimentacaoEstoque | Histórico de entradas/saídas/ajustes |
| 8 | Kit | Conjunto de produtos vendido como solução |
| 9 | ItemKit | Composição de cada kit |
| 10 | Pedido | Compra realizada pelo cliente |
| 11 | ItemPedido | Produtos/kits e quantidades do pedido |
| 12 | Entrega | Endereço e status do envio |

## Estrutura de pastas

```
elevmanutencao-backend/
├─ index.js          # entrypoint (Railway roda "npm start" → este arquivo)
├─ sync.js            # cria as 12 tabelas (rodar 1x via Pre-Deploy Command)
├─ seed.js            # popula categorias, fornecedor, produtos, estoque e kits de exemplo
└─ src/
   ├─ server/app.js    # Express + rotas
   ├─ routes/          # 1 arquivo por entidade
   ├─ controllers/     # recebem req/res, chamam os services
   ├─ services/        # regras de negócio (validações, transações)
   ├─ models/          # 12 models Sequelize + rel.js (associações)
   ├─ middlewares/      # auth.middleware (JWT) e isAdmin.middleware
   ├─ utils/            # validação de CPF/CNPJ/e-mail/telefone/CEP, bcrypt, JWT
   └─ db/conn.js         # conexão — lê DATABASE_URL (Railway) automaticamente
```

## Autenticação

Rotas privadas exigem o header:
```
Authorization: Bearer SEU_TOKEN_AQUI
```
O token é obtido em `POST /login`. Rotas de administração (produto, categoria,
fornecedor, estoque, kit, pedidos/status, entrega, relatório) exigem `tipo: 'ADMIN'`.

## Principais endpoints

| Método | Rota | Acesso | Função |
|---|---|---|---|
| POST | /login | Público | Login e emissão de JWT |
| POST | /usuario | Público | Cadastro de cliente |
| GET | /usuario/perfil | Privado | Dados do usuário logado |
| GET/POST/PUT/DELETE | /endereco | Privado | Endereços do usuário |
| GET | /categoria | Público | Lista categorias ativas |
| GET | /produto | Público | Catálogo (filtros: nome, codigo, categoria, disponivel, precoMin, precoMax) |
| GET | /produto/:id | Público | Detalhe do produto |
| GET | /kit | Público | Lista kits com disponibilidade calculada |
| GET | /kit/:id | Público | Detalhe do kit + composição |
| POST | /pedido | Privado | Finaliza a compra (produtos e/ou kits) |
| GET | /pedido/meus-pedidos | Privado | Histórico do cliente |
| POST/PUT/DELETE | /categoria, /fornecedor, /produto, /kit | Admin | CRUD de catálogo |
| GET/POST/PUT | /estoque | Admin | Saldo, movimentações e parâmetros |
| GET/PATCH | /pedido, /entrega | Admin | Gestão de pedidos e entregas |
| GET | /relatorio/vendas, /relatorio/estoque, /relatorio/indicadores | Admin | Dados para os gráficos do painel |

## Regra de ouro do checkout (`POST /pedido`)

```json
{
  "idEndereco": 1,
  "itens": [
    { "tipo": "produto", "id": 3, "quantidade": 2 },
    { "tipo": "kit", "id": 1, "quantidade": 1 }
  ]
}
```

Tudo roda em **uma transação**: se qualquer produto (ou componente de um kit)
não tiver estoque suficiente, o pedido inteiro é cancelado, nada é criado e
nenhuma quantidade é deduzida.
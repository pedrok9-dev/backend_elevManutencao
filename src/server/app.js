const express = require('express')
const cors = require('cors')

const app = express()

// ------------------ Middlewares globais ------------------
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))

// ------------------ Rotas ------------------
const authRoutes = require('../routes/auth.routes')
const usuarioRoutes = require('../routes/usuario.routes')
const enderecoRoutes = require('../routes/endereco.routes')
const categoriaRoutes = require('../routes/categoria.routes')
const fornecedorRoutes = require('../routes/fornecedor.routes')
const produtoRoutes = require('../routes/produto.routes')
const estoqueRoutes = require('../routes/estoque.routes')
const kitRoutes = require('../routes/kit.routes')
const pedidoRoutes = require('../routes/pedido.routes')
const entregaRoutes = require('../routes/entrega.routes')
const relatorioRoutes = require('../routes/relatorio.routes')

app.use('/', authRoutes)                 // POST /login
app.use('/usuario', usuarioRoutes)       // POST /usuario, GET /usuario/perfil, PUT /usuario/:id
app.use('/endereco', enderecoRoutes)
app.use('/categoria', categoriaRoutes)
app.use('/fornecedor', fornecedorRoutes)
app.use('/produto', produtoRoutes)
app.use('/estoque', estoqueRoutes)
app.use('/kit', kitRoutes)
app.use('/pedido', pedidoRoutes)
app.use('/entrega', entregaRoutes)
app.use('/relatorio', relatorioRoutes)

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API ElevManutenção funcionando!' })
})

// Handler simples para rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' })
})

module.exports = app

const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

// ------------------ Middlewares globais ------------------
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '10mb' }))

// Permite que o frontend (ex: hospedado no Vercel) fale com este backend rodando no seu PC
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true')
  next()
})
app.use(cors({ origin: '*' }))

// ------------------ Imagens enviadas (backend/uploads) ------------------
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')))

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

app.use('/', authRoutes)                 
app.use('/usuario', usuarioRoutes)       
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

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API ElevManutenção funcionando!' })
})

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' })
})

app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ erro: 'Imagem muito grande. Use uma imagem de até 5 MB.' })
  }
  console.error(err)
  return res.status(err.status || 500).json({ erro: err.message || 'Erro interno do servidor' })
})

module.exports = app
const express = require('express')
const router = express.Router()
const relatorioController = require('../controllers/relatorio.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

router.use(authMiddleware, isAdminMiddleware) // relatórios são área administrativa

router.get('/vendas', relatorioController.vendasPorCategoria)
router.get('/estoque', relatorioController.situacaoEstoque)
router.get('/indicadores', relatorioController.indicadores)

module.exports = router

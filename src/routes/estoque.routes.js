const express = require('express')
const router = express.Router()
const estoqueController = require('../controllers/estoque.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

router.use(authMiddleware, isAdminMiddleware) // estoque é área administrativa

router.get('/', estoqueController.listar)
router.get('/movimentacoes', estoqueController.listarMovimentacoes)
router.post('/movimentacao', estoqueController.movimentar)
router.put('/:idProduto', estoqueController.atualizarParametros)

module.exports = router

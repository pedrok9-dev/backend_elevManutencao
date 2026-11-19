const express = require('express')
const router = express.Router()
const pedidoController = require('../controllers/pedido.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

router.use(authMiddleware) // toda a área de pedidos exige login

router.post('/', pedidoController.criar)
router.get('/meus-pedidos', pedidoController.meusPedidos)
router.get('/:id', pedidoController.buscar)

router.get('/', isAdminMiddleware, pedidoController.listarTodos)
router.patch('/:id/status', isAdminMiddleware, pedidoController.atualizarStatus)

module.exports = router

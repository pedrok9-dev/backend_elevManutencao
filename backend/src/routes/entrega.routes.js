const express = require('express')
const router = express.Router()
const entregaController = require('../controllers/entrega.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

router.use(authMiddleware, isAdminMiddleware) // entregas gerenciadas pelo admin

router.get('/', entregaController.listar)
router.patch('/:idPedido', entregaController.atualizar)

module.exports = router

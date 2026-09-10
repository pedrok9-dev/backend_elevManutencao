const express = require('express')
const router = express.Router()
const kitController = require('../controllers/kit.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

router.get('/', kitController.listar) // público
router.get('/:id', kitController.buscar) // público

router.post('/', authMiddleware, isAdminMiddleware, kitController.criar)
router.put('/:id', authMiddleware, isAdminMiddleware, kitController.atualizar)
router.delete('/:id', authMiddleware, isAdminMiddleware, kitController.deletar)
router.put('/:id/itens', authMiddleware, isAdminMiddleware, kitController.definirComposicao)

module.exports = router

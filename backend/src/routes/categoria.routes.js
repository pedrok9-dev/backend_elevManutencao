const express = require('express')
const router = express.Router()
const categoriaController = require('../controllers/categoria.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

router.get('/', categoriaController.listar) // público
router.post('/', authMiddleware, isAdminMiddleware, categoriaController.criar)
router.put('/:id', authMiddleware, isAdminMiddleware, categoriaController.atualizar)
router.delete('/:id', authMiddleware, isAdminMiddleware, categoriaController.deletar)

module.exports = router

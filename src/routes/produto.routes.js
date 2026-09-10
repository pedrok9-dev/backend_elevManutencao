const express = require('express')
const router = express.Router()
const { criar, listar, buscar, atualizar, atualizarCompleto, deletar } = require('../controllers/produto.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

router.get('/', listar) // público
router.get('/:id', buscar) // público

router.post('/', authMiddleware, isAdminMiddleware, criar)
router.patch('/:id', authMiddleware, isAdminMiddleware, atualizar)
router.put('/:id', authMiddleware, isAdminMiddleware, atualizarCompleto)
router.delete('/:id', authMiddleware, isAdminMiddleware, deletar)

module.exports = router

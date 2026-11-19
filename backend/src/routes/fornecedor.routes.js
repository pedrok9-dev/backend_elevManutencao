const express = require('express')
const router = express.Router()
const fornecedorController = require('../controllers/fornecedor.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

router.use(authMiddleware, isAdminMiddleware) // fornecedor é área administrativa

router.get('/', fornecedorController.listar)
router.post('/', fornecedorController.criar)
router.put('/:id', fornecedorController.atualizar)
router.delete('/:id', fornecedorController.deletar)

module.exports = router

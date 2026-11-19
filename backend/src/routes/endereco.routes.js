const express = require('express')
const router = express.Router()
const enderecoController = require('../controllers/endereco.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.use(authMiddleware) // todas as rotas de endereço exigem login

router.post('/', enderecoController.criar)
router.get('/', enderecoController.listar)
router.put('/:id', enderecoController.atualizar)
router.delete('/:id', enderecoController.apagar)

module.exports = router

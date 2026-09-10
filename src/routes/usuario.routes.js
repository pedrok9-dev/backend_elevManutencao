const express = require('express')
const router = express.Router()
const usuarioController = require('../controllers/usuario.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/', usuarioController.cadastrar) // público
router.get('/perfil', authMiddleware, usuarioController.perfil) // privado
router.put('/:id', authMiddleware, usuarioController.atualizar) // privado

module.exports = router

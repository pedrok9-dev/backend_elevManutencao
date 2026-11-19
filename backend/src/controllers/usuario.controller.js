const usuarioService = require('../services/usuario.service')

async function cadastrar(req, res) {
  try {
    await usuarioService.cadastrar(req.body)
    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' })
  } catch (err) {
    console.error('Erro no controller de cadastro:', err.message)
    return res.status(400).json({ mensagem: err.message || 'Erro ao cadastrar usuário' })
  }
}

async function perfil(req, res) {
  try {
    const usuario = await usuarioService.buscarPerfil(req.user.id)
    return res.status(200).json(usuario)
  } catch (err) {
    return res.status(404).json({ erro: err.message })
  }
}

async function atualizar(req, res) {
  try {
    const { id } = req.params
    if (Number(id) !== req.user.id && req.user.tipo !== 'ADMIN') {
      return res.status(403).json({ erro: 'Você só pode atualizar seu próprio cadastro' })
    }
    const usuario = await usuarioService.atualizarPerfil(id, req.body)
    return res.status(200).json({ mensagem: 'Cadastro atualizado com sucesso', usuario })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

module.exports = { cadastrar, perfil, atualizar }

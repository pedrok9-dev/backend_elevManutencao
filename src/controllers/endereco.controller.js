const enderecoService = require('../services/endereco.service')

async function criar(req, res) {
  try {
    const endereco = await enderecoService.criar(req.user.id, req.body)
    return res.status(201).json({ mensagem: 'Endereço cadastrado com sucesso', endereco })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

async function listar(req, res) {
  try {
    const enderecos = await enderecoService.listarPorUsuario(req.user.id)
    return res.status(200).json(enderecos)
  } catch (err) {
    return res.status(500).json({ erro: err.message })
  }
}

async function atualizar(req, res) {
  try {
    const endereco = await enderecoService.atualizar(req.user.id, req.params.id, req.body)
    return res.status(200).json({ mensagem: 'Endereço atualizado com sucesso', endereco })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

async function apagar(req, res) {
  try {
    await enderecoService.apagar(req.user.id, req.params.id)
    return res.status(200).json({ mensagem: 'Endereço removido com sucesso' })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

module.exports = { criar, listar, atualizar, apagar }

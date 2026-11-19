const fornecedorService = require('../services/fornecedor.service')

async function criar(req, res) {
  try {
    const fornecedor = await fornecedorService.criar(req.body)
    return res.status(201).json({ mensagem: 'Fornecedor cadastrado com sucesso', fornecedor })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

async function listar(req, res) {
  try {
    const apenasAtivos = req.query.ativos !== 'false'
    const fornecedores = await fornecedorService.listar({ apenasAtivos })
    return res.status(200).json(fornecedores)
  } catch (err) {
    return res.status(500).json({ erro: err.message })
  }
}

async function atualizar(req, res) {
  try {
    const fornecedor = await fornecedorService.atualizar(req.params.id, req.body)
    return res.status(200).json({ mensagem: 'Fornecedor atualizado com sucesso', fornecedor })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

async function deletar(req, res) {
  try {
    await fornecedorService.apagar(req.params.id)
    return res.status(200).json({ mensagem: 'Fornecedor desativado com sucesso' })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

module.exports = { criar, listar, atualizar, deletar }

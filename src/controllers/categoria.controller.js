const categoriaService = require('../services/categoria.service')

async function criar(req, res) {
  try {
    const categoria = await categoriaService.criar(req.body)
    return res.status(201).json({ mensagem: 'Categoria criada com sucesso', categoria })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

async function listar(req, res) {
  try {
    const apenasAtivas = req.query.ativas !== 'false'
    const categorias = await categoriaService.listar({ apenasAtivas })
    return res.status(200).json(categorias)
  } catch (err) {
    return res.status(500).json({ erro: err.message })
  }
}

async function atualizar(req, res) {
  try {
    const categoria = await categoriaService.atualizar(req.params.id, req.body)
    return res.status(200).json({ mensagem: 'Categoria atualizada com sucesso', categoria })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

async function deletar(req, res) {
  try {
    await categoriaService.apagar(req.params.id)
    return res.status(200).json({ mensagem: 'Categoria desativada com sucesso' })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

module.exports = { criar, listar, atualizar, deletar }

const {
  criarProduto, listarProdutos, buscarProdutoPorId,
  atualizarProduto, atualizarProdutoCompleto, apagarProduto
} = require('../services/produto.service')

async function criar(req, res) {
  try {
    const produto = await criarProduto(req.body)
    return res.status(201).json({ mensagem: 'Produto criado com sucesso', produto })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

async function listar(req, res) {
  try {
    const { nome, codigo, categoria, disponivel, precoMin, precoMax, ordenarPor } = req.query
    const produtos = await listarProdutos({
      nome, codigo, idCategoria: categoria, disponivel, precoMin, precoMax, ordenarPor
    })
    return res.status(200).json(produtos)
  } catch (err) {
    return res.status(500).json({ erro: err.message })
  }
}

async function buscar(req, res) {
  try {
    const produto = await buscarProdutoPorId(req.params.id)
    return res.status(200).json(produto)
  } catch (err) {
    return res.status(404).json({ erro: err.message })
  }
}

async function atualizar(req, res) {
  try {
    const { id } = req.params
    const produtoAtualizado = await atualizarProduto(id, req.body)
    return res.status(200).json({ mensagem: 'Produto atualizado com sucesso', produto: produtoAtualizado })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

async function atualizarCompleto(req, res) {
  try {
    const { id } = req.params
    const produtoAtualizado = await atualizarProdutoCompleto(id, req.body)
    return res.status(200).json({ mensagem: 'Produto atualizado completamente com sucesso', produto: produtoAtualizado })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

async function deletar(req, res) {
  try {
    const { id } = req.params
    await apagarProduto(id)
    return res.status(200).json({ mensagem: 'Produto desativado com sucesso' })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

module.exports = { criar, listar, buscar, atualizar, atualizarCompleto, deletar }

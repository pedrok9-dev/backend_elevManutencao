const estoqueService = require('../services/estoque.service')

async function listar(req, res) {
  try {
    const apenasCriticos = req.query.criticos === 'true'
    const estoques = await estoqueService.listarEstoque({ apenasCriticos })
    return res.status(200).json(estoques)
  } catch (err) {
    return res.status(500).json({ erro: err.message })
  }
}

async function movimentar(req, res) {
  try {
    const { idProduto, tipo, quantidade, motivo } = req.body
    const resultado = await estoqueService.registrarMovimentacao({
      idProduto, tipo, quantidade, motivo, idUsuarioAdmin: req.user.id
    })
    return res.status(201).json({ mensagem: 'Movimentação registrada com sucesso', ...resultado })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

async function atualizarParametros(req, res) {
  try {
    const estoque = await estoqueService.atualizarParametros(req.params.idProduto, req.body)
    return res.status(200).json({ mensagem: 'Parâmetros de estoque atualizados', estoque })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

async function listarMovimentacoes(req, res) {
  try {
    const movimentacoes = await estoqueService.listarMovimentacoes(req.query.idProduto)
    return res.status(200).json(movimentacoes)
  } catch (err) {
    return res.status(500).json({ erro: err.message })
  }
}

module.exports = { listar, movimentar, atualizarParametros, listarMovimentacoes }

const pedidoService = require('../services/pedido.service')

async function criar(req, res) {
  try {
    const pedido = await pedidoService.criarPedido(req.user.id, req.body)
    return res.status(201).json({ mensagem: 'Pedido realizado com sucesso', pedido })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

async function meusPedidos(req, res) {
  try {
    const pedidos = await pedidoService.listarMeusPedidos(req.user.id)
    return res.status(200).json(pedidos)
  } catch (err) {
    return res.status(500).json({ erro: err.message })
  }
}

async function buscar(req, res) {
  try {
    const idUsuario = req.user.tipo === 'ADMIN' ? null : req.user.id
    const pedido = await pedidoService.buscarPedidoPorId(req.params.id, idUsuario)
    return res.status(200).json(pedido)
  } catch (err) {
    return res.status(404).json({ erro: err.message })
  }
}

async function listarTodos(req, res) {
  try {
    const pedidos = await pedidoService.listarTodosPedidos({ status: req.query.status })
    return res.status(200).json(pedidos)
  } catch (err) {
    return res.status(500).json({ erro: err.message })
  }
}

async function atualizarStatus(req, res) {
  try {
    const pedido = await pedidoService.atualizarStatus(req.params.id, req.body.status)
    return res.status(200).json({ mensagem: 'Status do pedido atualizado', pedido })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

module.exports = { criar, meusPedidos, buscar, listarTodos, atualizarStatus }

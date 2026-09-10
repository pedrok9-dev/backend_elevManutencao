const entregaService = require('../services/entrega.service')

async function listar(req, res) {
  try {
    const entregas = await entregaService.listarEntregas({ status: req.query.status })
    return res.status(200).json(entregas)
  } catch (err) {
    return res.status(500).json({ erro: err.message })
  }
}

async function atualizar(req, res) {
  try {
    const entrega = await entregaService.atualizarStatus(req.params.idPedido, req.body)
    return res.status(200).json({ mensagem: 'Entrega atualizada com sucesso', entrega })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

module.exports = { listar, atualizar }

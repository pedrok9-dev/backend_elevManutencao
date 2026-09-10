const kitService = require('../services/kit.service')

async function criar(req, res) {
  try {
    const kit = await kitService.criarKit(req.body)
    return res.status(201).json({ mensagem: 'Kit criado com sucesso', kit })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

async function listar(req, res) {
  try {
    const apenasAtivos = req.query.ativos !== 'false'
    const kits = await kitService.listarKits({ apenasAtivos })
    return res.status(200).json(kits)
  } catch (err) {
    return res.status(500).json({ erro: err.message })
  }
}

async function buscar(req, res) {
  try {
    const kit = await kitService.buscarKitPorId(req.params.id)
    return res.status(200).json(kit)
  } catch (err) {
    return res.status(404).json({ erro: err.message })
  }
}

async function atualizar(req, res) {
  try {
    const kit = await kitService.atualizarKit(req.params.id, req.body)
    return res.status(200).json({ mensagem: 'Kit atualizado com sucesso', kit })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

async function deletar(req, res) {
  try {
    await kitService.apagarKit(req.params.id)
    return res.status(200).json({ mensagem: 'Kit desativado com sucesso' })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

async function definirComposicao(req, res) {
  try {
    await kitService.definirComposicao(req.params.id, req.body.itens)
    return res.status(200).json({ mensagem: 'Composição do kit atualizada com sucesso' })
  } catch (err) {
    return res.status(400).json({ erro: err.message })
  }
}

module.exports = { criar, listar, buscar, atualizar, deletar, definirComposicao }

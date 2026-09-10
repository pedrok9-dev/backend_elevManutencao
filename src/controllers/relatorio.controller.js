const relatorioService = require('../services/relatorio.service')

async function vendasPorCategoria(req, res) {
  try {
    const dados = await relatorioService.vendasPorCategoria()
    return res.status(200).json(dados)
  } catch (err) {
    return res.status(500).json({ erro: err.message })
  }
}

async function situacaoEstoque(req, res) {
  try {
    const dados = await relatorioService.situacaoEstoque()
    return res.status(200).json(dados)
  } catch (err) {
    return res.status(500).json({ erro: err.message })
  }
}

async function indicadores(req, res) {
  try {
    const dados = await relatorioService.indicadoresGerais()
    return res.status(200).json(dados)
  } catch (err) {
    return res.status(500).json({ erro: err.message })
  }
}

module.exports = { vendasPorCategoria, situacaoEstoque, indicadores }

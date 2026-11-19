const db = require('../db/conn')
const Estoque = require('../models/Estoque')
const MovimentacaoEstoque = require('../models/MovimentacaoEstoque')
const Produto = require('../models/Produto')

async function listarEstoque({ apenasCriticos } = {}) {
  const estoques = await Estoque.findAll({
    include: [{ model: Produto, as: 'produtoEstoque', attributes: ['codProduto', 'nome', 'codigoInterno'] }],
    order: [['quantidade_atual', 'ASC']]
  })

  if (apenasCriticos === true || apenasCriticos === 'true') {
    return estoques.filter(e => e.quantidade_atual <= e.quantidade_minima)
  }

  return estoques
}

async function registrarMovimentacao({ idProduto, tipo, quantidade, motivo, idPedido, idUsuarioAdmin }) {
  if (!idProduto || !tipo || !quantidade) {
    throw new Error('Produto, tipo e quantidade são obrigatórios')
  }

  if (!['ENTRADA', 'SAIDA', 'AJUSTE'].includes(tipo)) {
    throw new Error('Tipo de movimentação inválido')
  }

  if (Number(quantidade) <= 0) {
    throw new Error('A quantidade movimentada deve ser positiva')
  }

  return await db.transaction(async (t) => {
    const estoque = await Estoque.findOne({ where: { idProduto }, transaction: t, lock: t.LOCK.UPDATE })
    if (!estoque) throw new Error('Estoque do produto não encontrado')

    let novaQuantidade = estoque.quantidade_atual
    if (tipo === 'ENTRADA') novaQuantidade += Number(quantidade)
    if (tipo === 'SAIDA') novaQuantidade -= Number(quantidade)
    if (tipo === 'AJUSTE') novaQuantidade = Number(quantidade)

    if (novaQuantidade < 0) {
      throw new Error('Estoque não pode ficar negativo')
    }

    await estoque.update({ quantidade_atual: novaQuantidade, ultima_atualizacao: new Date() }, { transaction: t })

    const movimentacao = await MovimentacaoEstoque.create({
      idProduto,
      tipo,
      quantidade,
      motivo: motivo || (tipo === 'ENTRADA' ? 'reposição' : tipo === 'SAIDA' ? 'venda' : 'ajuste'),
      idPedido: idPedido || null,
      idUsuarioAdmin: idUsuarioAdmin || null
    }, { transaction: t })

    return { estoque, movimentacao }
  })
}

async function atualizarParametros(idProduto, dados) {
  const estoque = await Estoque.findOne({ where: { idProduto } })
  if (!estoque) throw new Error('Estoque do produto não encontrado')

  const { quantidade_minima } = dados
  await estoque.update({ quantidade_minima })
  return estoque
}

async function listarMovimentacoes(idProduto) {
  const where = idProduto ? { idProduto } : {}
  return await MovimentacaoEstoque.findAll({
    where,
    order: [['data_movimentacao', 'DESC']],
    limit: 200
  })
}

module.exports = { listarEstoque, registrarMovimentacao, atualizarParametros, listarMovimentacoes }
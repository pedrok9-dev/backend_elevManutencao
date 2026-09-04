const db = require('../db/conn')
const Kit = require('../models/Kit')
const ItemKit = require('../models/ItemKit')
const Produto = require('../models/Produto')
const Estoque = require('../models/Estoque')
const Categoria = require('../models/Categoria')

async function calcularDisponibilidade(kit) {
  if (!kit.itensKit || kit.itensKit.length === 0) return 0

  const disponibilidades = kit.itensKit.map(item => {
    const saldo = item.produtoItemKit?.estoqueProduto?.quantidade_atual ?? 0
    return Math.floor(saldo / item.quantidade)
  })

  return Math.min(...disponibilidades)
}

async function criarKit(dados) {
  const { idCategoria, nome, descricao, preco, imagem_url, itens } = dados

  if (!nome || !preco) {
    throw new Error('Nome e preço do kit são obrigatórios')
  }

  return await db.transaction(async (t) => {
    const kit = await Kit.create({ idCategoria: idCategoria || null, nome, descricao, preco, imagem_url, ativo: true }, { transaction: t })

    if (Array.isArray(itens) && itens.length > 0) {
      for (const item of itens) {
        if (!item.idProduto || !item.quantidade) {
          throw new Error('Cada item do kit precisa de idProduto e quantidade')
        }
        await ItemKit.create({ idKit: kit.codKit, idProduto: item.idProduto, quantidade: item.quantidade }, { transaction: t })
      }
    }

    return kit
  })
}

async function listarKits({ apenasAtivos } = {}) {
  const where = apenasAtivos !== false ? { ativo: true } : {}

  const kits = await Kit.findAll({
    where,
    include: [
      { model: Categoria, as: 'categoriaKit', attributes: ['codCategoria', 'nome'] },
      {
        model: ItemKit,
        as: 'itensKit',
        include: [{
          model: Produto,
          as: 'produtoItemKit',
          attributes: ['codProduto', 'nome'],
          include: [{ model: Estoque, as: 'estoqueProduto', attributes: ['quantidade_atual'] }]
        }]
      }
    ]
  })

  const resultado = []
  for (const kit of kits) {
    const disponibilidade = await calcularDisponibilidade(kit)
    resultado.push({ ...kit.toJSON(), disponibilidade })
  }

  return resultado
}

async function buscarKitPorId(id) {
  const kit = await Kit.findByPk(id, {
    include: [
      { model: Categoria, as: 'categoriaKit', attributes: ['codCategoria', 'nome'] },
      {
        model: ItemKit,
        as: 'itensKit',
        include: [{
          model: Produto,
          as: 'produtoItemKit',
          attributes: ['codProduto', 'nome', 'preco'],
          include: [{ model: Estoque, as: 'estoqueProduto', attributes: ['quantidade_atual'] }]
        }]
      }
    ]
  })

  if (!kit) throw new Error('Kit não encontrado')

  const disponibilidade = await calcularDisponibilidade(kit)
  return { ...kit.toJSON(), disponibilidade }
}

async function atualizarKit(id, dados) {
  const kit = await Kit.findByPk(id)
  if (!kit) throw new Error('Kit não encontrado')

  await kit.update(dados)
  return kit
}

async function apagarKit(id) {
  const kit = await Kit.findByPk(id)
  if (!kit) throw new Error('Kit não encontrado')

  await kit.update({ ativo: false })
  return true
}

async function definirComposicao(idKit, itens) {
  if (!Array.isArray(itens) || itens.length === 0) {
    throw new Error('Informe ao menos um item para compor o kit')
  }

  return await db.transaction(async (t) => {
    const kit = await Kit.findByPk(idKit, { transaction: t })
    if (!kit) throw new Error('Kit não encontrado')

    await ItemKit.destroy({ where: { idKit }, transaction: t })

    for (const item of itens) {
      if (!item.idProduto || !item.quantidade) {
        throw new Error('Cada item do kit precisa de idProduto e quantidade')
      }
      await ItemKit.create({ idKit, idProduto: item.idProduto, quantidade: item.quantidade }, { transaction: t })
    }

    return true
  })
}

module.exports = {
  criarKit,
  listarKits,
  buscarKitPorId,
  atualizarKit,
  apagarKit,
  definirComposicao,
  calcularDisponibilidade
}
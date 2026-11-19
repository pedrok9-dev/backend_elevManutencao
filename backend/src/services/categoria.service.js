const Categoria = require('../models/Categoria')

async function criar(dados) {
  const { nome, descricao } = dados
  if (!nome) {
    throw new Error('Nome da categoria é obrigatório')
  }

  const existente = await Categoria.findOne({ where: { nome } })
  if (existente) {
    throw new Error('Já existe uma categoria com esse nome')
  }

  return await Categoria.create({ nome, descricao, ativo: true })
}

async function listar({ apenasAtivas } = {}) {
  const where = apenasAtivas ? { ativo: true } : {}
  return await Categoria.findAll({ where, order: [['nome', 'ASC']] })
}

async function buscarPorId(id) {
  const categoria = await Categoria.findByPk(id)
  if (!categoria) throw new Error('Categoria não encontrada')
  return categoria
}

async function atualizar(id, dados) {
  const categoria = await buscarPorId(id)
  await categoria.update(dados)
  return categoria
}

async function apagar(id) {
  const categoria = await buscarPorId(id)
  // exclusão lógica: preserva histórico de produtos já cadastrados
  await categoria.update({ ativo: false })
  return true
}

module.exports = { criar, listar, buscarPorId, atualizar, apagar }
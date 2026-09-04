const { Op } = require('sequelize')
const Produto = require('../models/Produto')
const Categoria = require('../models/Categoria')
const Fornecedor = require('../models/Fornecedor')
const Estoque = require('../models/Estoque')

async function criarProduto(dados) {
  const { idCategoria, idFornecedor, codigoInterno, nome, descricao, preco, unidade, imagem_url } = dados

  if (!idCategoria || !codigoInterno || !nome || !preco) {
    throw new Error('Categoria, código interno, nome e preço são obrigatórios')
  }

  if (Number(preco) <= 0) {
    throw new Error('O preço deve ser um valor positivo')
  }

  const existente = await Produto.findOne({ where: { codigoInterno } })
  if (existente) {
    throw new Error('Já existe um produto com esse código interno')
  }

  const produto = await Produto.create({
    idCategoria,
    idFornecedor: idFornecedor || null,
    codigoInterno,
    nome,
    descricao,
    preco,
    unidade: unidade || 'unidade',
    imagem_url,
    ativo: true
  })

  await Estoque.create({
    idProduto: produto.codProduto,
    quantidade_atual: dados.quantidade_atual || 0,
    quantidade_minima: dados.quantidade_minima || 0,
    ultima_atualizacao: new Date()
  })

  return produto
}

async function listarProdutos(filtros = {}) {
  const { nome, codigo, idCategoria, disponivel, precoMin, precoMax, apenasAtivos, ordenarPor } = filtros

  const where = {}
  if (apenasAtivos !== false) where.ativo = true
  if (nome) where.nome = { [Op.like]: `%${nome}%` }
  if (codigo) where.codigoInterno = { [Op.like]: `%${codigo}%` }
  if (idCategoria) where.idCategoria = idCategoria
  if (precoMin || precoMax) {
    where.preco = {}
    if (precoMin) where.preco[Op.gte] = precoMin
    if (precoMax) where.preco[Op.lte] = precoMax
  }

  let ordem = [['nome', 'ASC']]
  if (ordenarPor === 'preco_asc') ordem = [['preco', 'ASC']]
  if (ordenarPor === 'preco_desc') ordem = [['preco', 'DESC']]

  const produtos = await Produto.findAll({
    where,
    include: [
      { model: Categoria, as: 'categoriaProduto', attributes: ['codCategoria', 'nome'] },
      { model: Estoque, as: 'estoqueProduto', attributes: ['quantidade_atual', 'quantidade_minima'] }
    ],
    order: ordem
  })

  if (disponivel === true || disponivel === 'true') {
    return produtos.filter(p => p.estoqueProduto && p.estoqueProduto.quantidade_atual > 0)
  }

  return produtos
}

async function buscarProdutoPorId(id) {
  const produto = await Produto.findByPk(id, {
    include: [
      { model: Categoria, as: 'categoriaProduto', attributes: ['codCategoria', 'nome'] },
      { model: Fornecedor, as: 'fornecedorProduto', attributes: ['codFornecedor', 'razaoSocial'] },
      { model: Estoque, as: 'estoqueProduto', attributes: ['quantidade_atual', 'quantidade_minima'] }
    ]
  })

  if (!produto) throw new Error('Produto não encontrado')
  return produto
}

async function atualizarProduto(id, dados) {
  const produto = await Produto.findByPk(id)
  if (!produto) throw new Error('Produto não encontrado')

  await produto.update(dados)
  return produto
}

async function atualizarProdutoCompleto(id, dados) {
  const produto = await Produto.findByPk(id)
  if (!produto) throw new Error('Produto não encontrado')

  const { idCategoria, codigoInterno, nome, descricao, preco, unidade, imagem_url, ativo } = dados

  if (!idCategoria || !codigoInterno || !nome || !preco) {
    throw new Error('Categoria, código interno, nome e preço são obrigatórios')
  }

  await produto.update({ idCategoria, codigoInterno, nome, descricao, preco, unidade, imagem_url, ativo })
  return produto
}

async function apagarProduto(id) {
  const produto = await Produto.findByPk(id)
  if (!produto) throw new Error('Produto não encontrado')

  await produto.update({ ativo: false })
  return true
}

module.exports = {
  criarProduto,
  listarProdutos,
  buscarProdutoPorId,
  atualizarProduto,
  atualizarProdutoCompleto,
  apagarProduto
}
const Fornecedor = require('../models/Fornecedor')
const { validaCNPJ, validaEmail } = require('../utils/validacao')

async function criar(dados) {
  const { razaoSocial, nomeFantasia, cnpj, email, telefone } = dados

  if (!razaoSocial || !cnpj) {
    throw new Error('Razão social e CNPJ são obrigatórios')
  }

  if (!validaCNPJ(cnpj)) {
    throw new Error('CNPJ inválido')
  }

  if (email && !validaEmail(email)) {
    throw new Error('Email inválido')
  }

  const existente = await Fornecedor.findOne({ where: { cnpj } })
  if (existente) {
    throw new Error('CNPJ já cadastrado')
  }

  return await Fornecedor.create({ razaoSocial, nomeFantasia, cnpj, email, telefone, ativo: true })
}

async function listar({ apenasAtivos } = {}) {
  const where = apenasAtivos ? { ativo: true } : {}
  return await Fornecedor.findAll({ where, order: [['razaoSocial', 'ASC']] })
}

async function buscarPorId(id) {
  const fornecedor = await Fornecedor.findByPk(id)
  if (!fornecedor) throw new Error('Fornecedor não encontrado')
  return fornecedor
}

async function atualizar(id, dados) {
  const fornecedor = await buscarPorId(id)

  if (dados.cnpj && !validaCNPJ(dados.cnpj)) {
    throw new Error('CNPJ inválido')
  }

  await fornecedor.update(dados)
  return fornecedor
}

async function apagar(id) {
  const fornecedor = await buscarPorId(id)
  await fornecedor.update({ ativo: false })
  return true
}

module.exports = { criar, listar, buscarPorId, atualizar, apagar }
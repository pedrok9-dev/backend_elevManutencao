const Endereco = require('../models/Endereco')
const { validaCEP } = require('../utils/validacao')

async function criar(idUsuario, dados) {
  const { cep, logradouro, numero, complemento, bairro, cidade, estado, principal } = dados

  if (!cep || !logradouro || !numero || !bairro || !cidade || !estado) {
    throw new Error('Campos obrigatórios do endereço não informados')
  }

  if (!validaCEP(cep)) {
    throw new Error('CEP inválido')
  }

  if (principal) {
    await Endereco.update({ principal: false }, { where: { idUsuario } })
  }

  const endereco = await Endereco.create({
    idUsuario,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    principal: !!principal
  })

  return endereco
}

async function listarPorUsuario(idUsuario) {
  return await Endereco.findAll({ where: { idUsuario }, order: [['principal', 'DESC']] })
}

async function atualizar(idUsuario, id, dados) {
  const endereco = await Endereco.findOne({ where: { codEndereco: id, idUsuario } })
  if (!endereco) {
    throw new Error('Endereço não encontrado')
  }

  if (dados.cep && !validaCEP(dados.cep)) {
    throw new Error('CEP inválido')
  }

  if (dados.principal) {
    await Endereco.update({ principal: false }, { where: { idUsuario } })
  }

  await endereco.update(dados)
  return endereco
}

async function apagar(idUsuario, id) {
  const endereco = await Endereco.findOne({ where: { codEndereco: id, idUsuario } })
  if (!endereco) {
    throw new Error('Endereço não encontrado')
  }

  await endereco.destroy()
  return true
}

module.exports = { criar, listarPorUsuario, atualizar, apagar }
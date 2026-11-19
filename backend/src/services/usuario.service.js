const Usuario = require('../models/Usuario')
const { validaEmail, validaTelefone, validaCPF } = require('../utils/validacao')
const { hashSenha } = require('../utils/criptografia')

async function cadastrar(dados) {
  const { nome, email, telefone, cpf, senha, tipo_usuario } = dados

  if (!nome || !email || !telefone || !cpf || !senha) {
    throw new Error('Campos obrigatórios não informados')
  }

  if (!validaEmail(email)) {
    throw new Error('Email inválido')
  }

  if (!validaTelefone(telefone)) {
    throw new Error('Telefone inválido')
  }

  if (!validaCPF(cpf)) {
    throw new Error('CPF inválido')
  }

  const usuarioEmail = await Usuario.findOne({ where: { email } })
  if (usuarioEmail) {
    throw new Error('Email já está cadastrado')
  }

  const usuarioCPF = await Usuario.findOne({ where: { cpf } })
  if (usuarioCPF) {
    throw new Error('CPF já está cadastrado')
  }

  const senhaBcrypt = await hashSenha(senha)

  await Usuario.create({
    nome,
    email,
    telefone,
    cpf,
    senha: senhaBcrypt,
    tipo_usuario: 'CLIENTE'
  })

  return { ok: true }
}

async function buscarPerfil(id) {
  const usuario = await Usuario.findByPk(id, {
    attributes: ['codUsuario', 'nome', 'email', 'telefone', 'cpf', 'tipo_usuario', 'ativo']
  })

  if (!usuario) {
    throw new Error('Usuário não encontrado')
  }

  return usuario
}

async function atualizarPerfil(id, dados) {
  const usuario = await Usuario.findByPk(id)
  if (!usuario) {
    throw new Error('Usuário não encontrado')
  }

  const { nome, telefone } = dados

  if (telefone && !validaTelefone(telefone)) {
    throw new Error('Telefone inválido')
  }

  await usuario.update({
    nome: nome ?? usuario.nome,
    telefone: telefone ?? usuario.telefone
  })

  return usuario
}

module.exports = { cadastrar, buscarPerfil, atualizarPerfil }
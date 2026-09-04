const Usuario = require('../models/Usuario')
const { compareSenha } = require('../utils/criptografia')
const { gerarToken } = require('../utils/tokenJWT')

async function login({ email, senha }) {
  if (!email || !senha) {
    throw new Error('E-mail e senha são obrigatórios')
  }

  const usuario = await Usuario.findOne({ where: { email } })
  if (!usuario) {
    throw new Error('Usuário não encontrado')
  }

  if (!usuario.ativo) {
    throw new Error('Usuário desativado')
  }

  const senhaValida = await compareSenha(senha, usuario.senha)
  if (!senhaValida) {
    throw new Error('Senha inválida')
  }

  const token = gerarToken({
    id: usuario.codUsuario,
    email: usuario.email,
    tipo: usuario.tipo_usuario
  })

  return {
    token,
    usuario: {
      id: usuario.codUsuario,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo_usuario
    }
  }
}

module.exports = { login }
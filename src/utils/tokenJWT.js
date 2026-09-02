const jwt = require('jsonwebtoken')
require('dotenv').config()
const SEGREDO = process.env.JWT_SECRET
const EXPIRA_EM = process.env.JWT_EXPIRES_IN || '8h'

function gerarToken(payload) {
  return jwt.sign(payload, SEGREDO, { expiresIn: EXPIRA_EM })
}

function verificarToken(token) {
  try {
    return jwt.verify(token, SEGREDO)
  } catch (err) {
    console.error('Erro ao verificar token')
    return null
  }
}

module.exports = { gerarToken, verificarToken }
const bcrypt = require('bcrypt')
require('dotenv').config()
const SALTOS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10

async function hashSenha(senha) {
  return await bcrypt.hash(senha, SALTOS)
}

async function compareSenha(senha, hash) {
  return await bcrypt.compare(senha, hash)
}

module.exports = { hashSenha, compareSenha }
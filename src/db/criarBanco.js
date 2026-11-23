const mysql = require('mysql2/promise')
const { BANCO } = require('../config/ambiente')

async function criarBancoSeNaoExistir() {
  const conexao = await mysql.createConnection({
    host: BANCO.host,
    port: BANCO.port,
    user: BANCO.user,
    password: BANCO.password
  })
  await conexao.query(
    `CREATE DATABASE IF NOT EXISTS \`${BANCO.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  )
  await conexao.end()
}

module.exports = criarBancoSeNaoExistir

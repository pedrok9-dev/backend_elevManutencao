// Configuração local (substitui o arquivo .env)
// Se o seu MySQL Workbench usa outro usuário/senha, altere aqui.

const BANCO = {
  host: 'localhost',
  port: 3306,
  database: 'db_elevmanutencao',
  user: 'root',
  password: 'senai'
}

const SERVIDOR = {
  port: 3000,
  host: 'localhost'
}

process.env.JWT_SECRET = process.env.JWT_SECRET || 'elevmanutencao_chave_local_de_desenvolvimento'
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h'
process.env.BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || '10'

module.exports = { BANCO, SERVIDOR }

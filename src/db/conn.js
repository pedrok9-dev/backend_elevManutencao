const { Sequelize } = require('sequelize')
const { BANCO } = require('../config/ambiente')

const sequelize = new Sequelize(BANCO.database, BANCO.user, BANCO.password, {
  host: BANCO.host,
  port: BANCO.port,
  dialect: 'mysql',
  logging: false
})

module.exports = sequelize

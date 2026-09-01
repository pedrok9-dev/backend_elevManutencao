const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Fornecedor = db.define('fornecedor', {
  codFornecedor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  razaoSocial: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  nomeFantasia: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  cnpj: {
    type: DataTypes.STRING(18),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'fornecedores'
})

module.exports = Fornecedor
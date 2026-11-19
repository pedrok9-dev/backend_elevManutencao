const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Estoque = db.define('estoque', {
  codEstoque: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idProduto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, 
    references: {
      model: 'produtos',
      key: 'codProduto'
    }
  },
  quantidade_atual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  },
  quantidade_minima: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  ultima_atualizacao: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  tableName: 'estoques'
})

module.exports = Estoque
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
    unique: true, // garante o relacionamento 1:1
    references: {
      model: 'produtos',
      key: 'codProduto'
    }
  },
  quantidade_atual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 } // regra: estoque nunca fica negativo
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
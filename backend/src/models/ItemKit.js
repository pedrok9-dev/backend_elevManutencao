const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const ItemKit = db.define('itemKit', {
  codItemKit: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idKit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'kits',
      key: 'codKit'
    }
  },
  idProduto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'produtos',
      key: 'codProduto'
    }
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  indexes: [{
    unique: true,
    fields: ['idKit', 'idProduto'] 
  }],
  timestamps: false,
  tableName: 'itens_kit'
})

module.exports = ItemKit
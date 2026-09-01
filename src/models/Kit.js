const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Kit = db.define('kit', {
  codKit: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idCategoria: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categorias',
      key: 'codCategoria'
    }
  },
  nome: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  imagem_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'kits'
})

module.exports = Kit
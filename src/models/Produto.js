const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Produto = db.define('produto', {
  codProduto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idCategoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categorias',
      key: 'codCategoria'
    }
  },
  idFornecedor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'fornecedores',
      key: 'codFornecedor'
    }
  },
  codigoInterno: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
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
  unidade: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'unidade'
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
  tableName: 'produtos'
})

module.exports = Produto
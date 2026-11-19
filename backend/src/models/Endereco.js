const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Endereco = db.define('endereco', {
  codEndereco: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'codUsuario'
    }
  },
  cep: {
    type: DataTypes.STRING(9),
    allowNull: false
  },
  logradouro: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING(12),
    allowNull: false
  },
  complemento: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  bairro: {
    type: DataTypes.STRING(70),
    allowNull: false
  },
  cidade: {
    type: DataTypes.STRING(70),
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  principal: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
},{
  timestamps: true,
  tableName: 'enderecos'
})

module.exports = Endereco
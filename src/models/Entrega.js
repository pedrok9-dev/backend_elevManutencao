const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Entrega = db.define('entrega', {
  codEntrega: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idPedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'pedidos',
      key: 'codPedido'
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
  cidade: {
    type: DataTypes.STRING(70),
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('AGUARDANDO_SEPARACAO', 'EM_TRANSITO', 'ENTREGUE', 'OCORRENCIA'),
    allowNull: false,
    defaultValue: 'AGUARDANDO_SEPARACAO'
  },
  codigoRastreio: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  dataEnvio: {
    type: DataTypes.DATE,
    allowNull: true
  },
  dataEntrega: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'entregas'
})

module.exports = Entrega
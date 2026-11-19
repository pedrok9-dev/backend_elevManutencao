const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Pedido = db.define('pedido', {
  codPedido: {
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
  idEndereco: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'enderecos',
      key: 'codEndereco'
    }
  },
  valorTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  status: {
    type: DataTypes.ENUM('PENDENTE', 'CONFIRMADO', 'EM_PREPARACAO', 'ENVIADO', 'ENTREGUE', 'CANCELADO'),
    allowNull: false,
    defaultValue: 'PENDENTE'
  },
  dataPedido: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  tableName: 'pedidos'
})

module.exports = Pedido
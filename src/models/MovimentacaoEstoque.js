const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const MovimentacaoEstoque = db.define('movimentacaoEstoque', {
  codMovimentacao: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idProduto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'produtos',
      key: 'codProduto'
    }
  },
  tipo: {
    type: DataTypes.ENUM('ENTRADA', 'SAIDA', 'AJUSTE'),
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  motivo: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  idPedido: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'pedidos',
      key: 'codPedido'
    }
  },
  idUsuarioAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'codUsuario'
    }
  },
  data_movimentacao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  tableName: 'movimentacoes_estoque'
})

module.exports = MovimentacaoEstoque
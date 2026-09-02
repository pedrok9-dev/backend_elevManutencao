const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const ItemPedido = db.define('itemPedido', {
  codItemPedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idPedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pedidos',
      key: 'codPedido'
    }
  },
  // O item pode se referir a um Produto avulso OU a um Kit - nunca aos dois, nunca a nenhum.
  idProduto: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'produtos',
      key: 'codProduto'
    }
  },
  idKit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'kits',
      key: 'codKit'
    }
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  precoUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  }
}, {
  timestamps: false,
  tableName: 'itens_pedido',
  validate: {
    apenasProdutoOuKit() {
      const temProduto = this.idProduto !== null && this.idProduto !== undefined
      const temKit = this.idKit !== null && this.idKit !== undefined

      if (temProduto === temKit) {
        throw new Error('Cada item do pedido deve referenciar exatamente um produto OU um kit')
      }
    }
  }
})

module.exports = ItemPedido
const Usuario = require('./Usuario')
const Endereco = require('./Endereco')
const Categoria = require('./Categoria')
const Fornecedor = require('./Fornecedor')
const Produto = require('./Produto')
const Estoque = require('./Estoque')
const MovimentacaoEstoque = require('./MovimentacaoEstoque')
const Kit = require('./Kit')
const ItemKit = require('./ItemKit')
const Pedido = require('./Pedido')
const ItemPedido = require('./ItemPedido')
const Entrega = require('./Entrega')

Usuario.hasMany(Endereco, {
  foreignKey: 'idUsuario',
  as: 'enderecosUsuario',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
Endereco.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuarioEndereco' })

Usuario.hasMany(Pedido, {
  foreignKey: 'idUsuario',
  as: 'pedidosUsuario',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})
Pedido.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuarioPedido' })

Usuario.hasMany(MovimentacaoEstoque, {
  foreignKey: 'idUsuarioAdmin',
  as: 'movimentacoesRegistradas',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})
MovimentacaoEstoque.belongsTo(Usuario, { foreignKey: 'idUsuarioAdmin', as: 'adminMovimentacao' })

Categoria.hasMany(Produto, {
  foreignKey: 'idCategoria',
  as: 'produtosCategoria',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})
Produto.belongsTo(Categoria, { foreignKey: 'idCategoria', as: 'categoriaProduto' })

Categoria.hasMany(Kit, {
  foreignKey: 'idCategoria',
  as: 'kitsCategoria',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})
Kit.belongsTo(Categoria, { foreignKey: 'idCategoria', as: 'categoriaKit' })

Fornecedor.hasMany(Produto, {
  foreignKey: 'idFornecedor',
  as: 'produtosFornecedor',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})
Produto.belongsTo(Fornecedor, { foreignKey: 'idFornecedor', as: 'fornecedorProduto' })

Produto.hasOne(Estoque, {
  foreignKey: 'idProduto',
  as: 'estoqueProduto',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
Estoque.belongsTo(Produto, { foreignKey: 'idProduto', as: 'produtoEstoque' })

Produto.hasMany(MovimentacaoEstoque, {
  foreignKey: 'idProduto',
  as: 'movimentacoesProduto',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
MovimentacaoEstoque.belongsTo(Produto, { foreignKey: 'idProduto', as: 'produtoMovimentacao' })

Produto.hasMany(ItemKit, {
  foreignKey: 'idProduto',
  as: 'itensKitProduto',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})
ItemKit.belongsTo(Produto, { foreignKey: 'idProduto', as: 'produtoItemKit' })

Produto.hasMany(ItemPedido, {
  foreignKey: 'idProduto',
  as: 'itensProduto',
  onDelete: 'RESTRICT', 
  onUpdate: 'CASCADE'
})
ItemPedido.belongsTo(Produto, { foreignKey: 'idProduto', as: 'produtoItem' })

Kit.hasMany(ItemKit, {
  foreignKey: 'idKit',
  as: 'itensKit',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
ItemKit.belongsTo(Kit, { foreignKey: 'idKit', as: 'kitItem' })

Kit.hasMany(ItemPedido, {
  foreignKey: 'idKit',
  as: 'itensKitVendido',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})
ItemPedido.belongsTo(Kit, { foreignKey: 'idKit', as: 'kitItemPedido' })

Endereco.hasMany(Pedido, {
  foreignKey: 'idEndereco',
  as: 'pedidosEndereco',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})
Pedido.belongsTo(Endereco, { foreignKey: 'idEndereco', as: 'enderecoPedido' })

Pedido.hasMany(ItemPedido, {
  foreignKey: 'idPedido',
  as: 'itensPedido',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
ItemPedido.belongsTo(Pedido, { foreignKey: 'idPedido', as: 'pedidoItem' })

Pedido.hasMany(MovimentacaoEstoque, {
  foreignKey: 'idPedido',
  as: 'movimentacoesPedido',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})
MovimentacaoEstoque.belongsTo(Pedido, { foreignKey: 'idPedido', as: 'pedidoMovimentacao' })

Pedido.hasOne(Entrega, {
  foreignKey: 'idPedido',
  as: 'entregaPedido',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
Entrega.belongsTo(Pedido, { foreignKey: 'idPedido', as: 'pedidoEntrega' })

module.exports = {
  Usuario,
  Endereco,
  Categoria,
  Fornecedor,
  Produto,
  Estoque,
  MovimentacaoEstoque,
  Kit,
  ItemKit,
  Pedido,
  ItemPedido,
  Entrega
}
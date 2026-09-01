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

// -------------------------------------------------------------------------
// 1. RELACIONAMENTOS USUÁRIO
// -------------------------------------------------------------------------

// USUÁRIO <-> ENDERECO (1:N)
Usuario.hasMany(Endereco, {
  foreignKey: 'idUsuario',
  as: 'enderecosUsuario',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
Endereco.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuarioEndereco' })

// USUÁRIO <-> PEDIDO (1:N)
Usuario.hasMany(Pedido, {
  foreignKey: 'idUsuario',
  as: 'pedidosUsuario',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})
Pedido.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuarioPedido' })

// USUÁRIO (ADMIN) <-> MOVIMENTACAO_ESTOQUE (1:N)
Usuario.hasMany(MovimentacaoEstoque, {
  foreignKey: 'idUsuarioAdmin',
  as: 'movimentacoesRegistradas',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})
MovimentacaoEstoque.belongsTo(Usuario, { foreignKey: 'idUsuarioAdmin', as: 'adminMovimentacao' })

// -------------------------------------------------------------------------
// 2. RELACIONAMENTOS CATEGORIA
// -------------------------------------------------------------------------

// CATEGORIA <-> PRODUTO (1:N)
Categoria.hasMany(Produto, {
  foreignKey: 'idCategoria',
  as: 'produtosCategoria',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})
Produto.belongsTo(Categoria, { foreignKey: 'idCategoria', as: 'categoriaProduto' })

// CATEGORIA <-> KIT (1:N)
Categoria.hasMany(Kit, {
  foreignKey: 'idCategoria',
  as: 'kitsCategoria',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})
Kit.belongsTo(Categoria, { foreignKey: 'idCategoria', as: 'categoriaKit' })

// -------------------------------------------------------------------------
// 3. RELACIONAMENTOS FORNECEDOR
// -------------------------------------------------------------------------

// FORNECEDOR <-> PRODUTO (1:N)
Fornecedor.hasMany(Produto, {
  foreignKey: 'idFornecedor',
  as: 'produtosFornecedor',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})
Produto.belongsTo(Fornecedor, { foreignKey: 'idFornecedor', as: 'fornecedorProduto' })

// -------------------------------------------------------------------------
// 4. RELACIONAMENTOS PRODUTO
// -------------------------------------------------------------------------

// PRODUTO <-> ESTOQUE (1:1)
Produto.hasOne(Estoque, {
  foreignKey: 'idProduto',
  as: 'estoqueProduto',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
Estoque.belongsTo(Produto, { foreignKey: 'idProduto', as: 'produtoEstoque' })

// PRODUTO <-> MOVIMENTACAO_ESTOQUE (1:N)
Produto.hasMany(MovimentacaoEstoque, {
  foreignKey: 'idProduto',
  as: 'movimentacoesProduto',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
MovimentacaoEstoque.belongsTo(Produto, { foreignKey: 'idProduto', as: 'produtoMovimentacao' })

// PRODUTO <-> ITEM_KIT (1:N - participa de kits)
Produto.hasMany(ItemKit, {
  foreignKey: 'idProduto',
  as: 'itensKitProduto',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})
ItemKit.belongsTo(Produto, { foreignKey: 'idProduto', as: 'produtoItemKit' })

// PRODUTO <-> ITEM_PEDIDO (1:N - vendas avulsas)
Produto.hasMany(ItemPedido, {
  foreignKey: 'idProduto',
  as: 'itensProduto',
  onDelete: 'RESTRICT', // protege o histórico de vendas
  onUpdate: 'CASCADE'
})
ItemPedido.belongsTo(Produto, { foreignKey: 'idProduto', as: 'produtoItem' })

// -------------------------------------------------------------------------
// 5. RELACIONAMENTOS KIT
// -------------------------------------------------------------------------

// KIT <-> ITEM_KIT (1:N - composição do kit)
Kit.hasMany(ItemKit, {
  foreignKey: 'idKit',
  as: 'itensKit',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
ItemKit.belongsTo(Kit, { foreignKey: 'idKit', as: 'kitItem' })

// KIT <-> ITEM_PEDIDO (1:N - vendas de kit)
Kit.hasMany(ItemPedido, {
  foreignKey: 'idKit',
  as: 'itensKitVendido',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})
ItemPedido.belongsTo(Kit, { foreignKey: 'idKit', as: 'kitItemPedido' })

// -------------------------------------------------------------------------
// 6. RELACIONAMENTOS PEDIDO
// -------------------------------------------------------------------------

// ENDERECO <-> PEDIDO (1:N - endereço usado no pedido)
Endereco.hasMany(Pedido, {
  foreignKey: 'idEndereco',
  as: 'pedidosEndereco',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})
Pedido.belongsTo(Endereco, { foreignKey: 'idEndereco', as: 'enderecoPedido' })

// PEDIDO <-> ITEM_PEDIDO (1:N)
Pedido.hasMany(ItemPedido, {
  foreignKey: 'idPedido',
  as: 'itensPedido',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
ItemPedido.belongsTo(Pedido, { foreignKey: 'idPedido', as: 'pedidoItem' })

// PEDIDO <-> MOVIMENTACAO_ESTOQUE (1:N - saídas geradas pela venda)
Pedido.hasMany(MovimentacaoEstoque, {
  foreignKey: 'idPedido',
  as: 'movimentacoesPedido',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})
MovimentacaoEstoque.belongsTo(Pedido, { foreignKey: 'idPedido', as: 'pedidoMovimentacao' })

// PEDIDO <-> ENTREGA (1:1)
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
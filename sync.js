const conn = require('./src/db/conn')

const {
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
} = require('./src/models/rel')

async function syncDataBase() {
  try {
    await conn.sync({ force: true })

    console.log('-----------------------------------------')
    console.log('Banco de dados ElevManutenção sincronizado!')
    console.log('12 tabelas criadas com sucesso.')
    console.log('-----------------------------------------')
  } catch (err) {
    console.error('ERRO: Não foi possível sincronizar o banco de dados!', err)
  } finally {
    await conn.close()
    console.log('Conexão com o banco de dados fechada.')
  }
}

syncDataBase()

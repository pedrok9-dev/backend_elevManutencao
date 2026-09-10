// Script utilitário para (re)criar todas as 12 tabelas do zero.
// ATENÇÃO: { force: true } apaga e recria as tabelas. Use apenas em ambiente de estudo/dev.
//
// Usa './src/db/conn' (não a versão "_local") de propósito: esse arquivo entende
// tanto o .env local (DB_NAME/DB_USER/...) quanto as variáveis que o Railway injeta
// automaticamente (DATABASE_URL ou MYSQLHOST/MYSQLUSER/...). Assim o mesmo comando
// funciona rodando na sua máquina OU como "Pre-Deploy Command" no Railway.
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

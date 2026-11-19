const { SERVIDOR } = require('./src/config/ambiente')
const criarBancoSeNaoExistir = require('./src/db/criarBanco')
require('./src/models/rel')
const app = require('./src/server/app')
const conn = require('./src/db/conn')

async function startServer() {
    try{
        await criarBancoSeNaoExistir()
        await conn.sync({alter: true})
        console.log('Banco sincronizado com { alter: true }')

        app.listen(SERVIDOR.port, SERVIDOR.host, ()=>{
            console.log(`Servidor rodando em http://${SERVIDOR.host}:${SERVIDOR.port}`)
        })
    }catch(err){
        console.error('Erro ao conectar ao banco ou iniciar o servidor:', err)
        process.exit(1)
    }
}

startServer()

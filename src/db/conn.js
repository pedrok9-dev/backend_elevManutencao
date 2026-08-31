const {Sequelize, Sequelize} = require('sequelize')
require('dotenv').config()

function getConnectionConfig(){
    const urlDireita = process.env.DATABASE_URL || process.env.MYSQL_URL
    if(urlDireita){
        return {uri: urlDireita, options: {dialect: 'mysql', dialectOptions:{}}}
    }

    if(process.env.MYSQLDATABASE && process.env.MYSQLUSER && process.env.MYSQLPASSOWORD){
        const db = process.env.MYSQLDATABASE
        const user = process.env.MYSQLUSER
        const pass = process.env.MYSQLPASSOWORD
        const host = process.env.MYSQLHOST || process.env.MYSQL_HOST || process.env.DB_HOST
        const port = process.env.MYSQLPORT || process.env.MYSQL_PORT || process.env.DB_PORT
        const uri = `mysql://${user}:${encodeURIComponent(pass)}@${host}:${port}/${db}`
        return{uri, options: {dialect: 'mysql', dialectOptions: {}}}
    }

    if(process.env.DB_NAME && process.env.DB_USER){
        const db = process.env.DB_NAME
    const user = process.env.DB_USER
    const pass = process.env.DB_PASS || ''
    const host = process.env.DB_HOST || 'localhost'
    const port = process.env.DB_PORT || 3306
    const uri = `mysql://${user}:${encodeURIComponent(pass)}@${host}:${port}/${db}`
    return { uri, options: { dialect: 'mysql', dialectOptions: {} } } 
    }

    throw new Error('Nenhuma configuração de banco de dados encontrada nas variáveis de ambiente. ')
}

const {uri, options} = getConnectionConfig()

const sequelize = new Sequelize(uri, {
    ...options,
    logging: process.env.NODE_ENV === 'production' ? false: console.log
})

async function testConnection() {
    try{
        await sequelize.authenticate()
        console.log('Conexão com o banco realizada com sucesso!')
    }catch(err){
        console.error('Erro ao conectar com banco de dados!', err)
    }
}
testConnection()

module.exports = sequelize
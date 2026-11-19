const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Categoria = db.define('categoria',{
    codCategoria:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome:{
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true
    },
    descricao:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    ativo:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
},{
    timestamps: true,
    tableName: 'categorias'
})

module.exports = Categoria
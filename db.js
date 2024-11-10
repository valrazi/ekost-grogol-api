require('dotenv').config()
const { Sequelize } = require('sequelize')
const { env } = process

const config = {
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE
}
const sequelize = new Sequelize(config.database, config.username, config.password,{
    host: config.host,
    port: config.port,
    dialect: 'mysql'
})
const db = sequelize
module.exports = db
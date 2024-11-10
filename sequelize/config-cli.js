require('dotenv').config()
const { env } = process

module.exports = {
    development: {
        dialect: "mysql",
        host: env.MYSQL_HOST,
        port: env.MYSQL_PORT,
        username: env.MYSQL_USERNAME,
        password: env.MYSQL_PASSWORD,
        database: env.MYSQL_DATABASE
    },
    production: {
        dialect: "mysql",
        host: env.MYSQL_HOST,
        port: env.MYSQL_PORT,
        username: env.MYSQL_USERNAME,
        password: env.MYSQL_PASSWORD,
        database: env.MYSQL_DATABASE
    }
}
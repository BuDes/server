const { Sequelize } = require('sequelize')

const db = new Sequelize("berlingvo", "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
    timezone: '+00:00',
})

module.exports = db
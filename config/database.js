const { Sequelize } = require('sequelize')

const db = new Sequelize("budes", "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
})

module.exports = db
const { STRING, UUIDV4 } = require("sequelize")
const sequelize = require("../../config/database")

const OpsiModel = sequelize.define("opsi", {
  id: {
    type: STRING,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  idSoal:{
    type: STRING,
    allowNull: false,
  },
  isi: {
    type: STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
})

module.exports = OpsiModel

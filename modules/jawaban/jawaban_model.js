const { STRING, UUIDV4 } = require("sequelize")
const sequelize = require("../../config/database")

const JawabanModel = sequelize.define("jawaban", {
  id: {
    type: STRING,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  idOpsi:{
    type: STRING,
    allowNull: true,
  },
  idSoal:{
    type: STRING,
    allowNull: true,
  },
  idRiwayat:{
    type: STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
})

module.exports = JawabanModel

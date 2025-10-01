const { STRING, UUIDV4 } = require("sequelize")
const sequelize = require("../../config/database")

const PesertaModel = sequelize.define("peserta", {
  id: {
    type: STRING,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  idUser: {
    type: STRING,
    allowNull: false,
  },
  idJadwalTest: {
    type: STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
})

module.exports = PesertaModel
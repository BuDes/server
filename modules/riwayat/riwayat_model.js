const { STRING, UUIDV4, DATE } = require("sequelize")
const sequelize = require("../../config/database")

const RiwayatModel = sequelize.define("riwayat", {
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
  idMateri: {
    type: STRING,
    allowNull: true,
  },
  idJadwalTest: {
    type: STRING,
    allowNull: true,
  },
}, {
  freezeTableName: true,
})

module.exports = RiwayatModel
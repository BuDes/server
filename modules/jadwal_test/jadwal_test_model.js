const { STRING, UUIDV4, DATE } = require("sequelize")
const sequelize = require("../../config/database")

const JadwalTestModel = sequelize.define("jadwal_test", {
  id: {
    type: STRING,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  nama: {
    type: STRING,
    allowNull: false,
  },
  tanggal: {
    type: DATE,
    allowNull: false,
  },
}, {
  freezeTableName: true,
})

module.exports = JadwalTestModel
const { STRING, UUIDV4, INTEGER } = require("sequelize")
const sequelize = require("../../config/database")

const JenisMateriModel = sequelize.define("jenis_materi", {
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
  gambar: {
    type: STRING,
    allowNull: false,
  },
  deskripsi: {
    type: STRING,
    allowNull: false,
  },
  jlhSoal: {
    type: INTEGER,
    allowNull: false,
  },
}, {
  freezeTableName: true,
})

module.exports = JenisMateriModel
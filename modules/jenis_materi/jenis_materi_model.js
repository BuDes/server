const { STRING, UUIDV4 } = require("sequelize")
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
    allowNull: true,
  },
  deskripsi: {
    type: STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
})

module.exports = JenisMateriModel
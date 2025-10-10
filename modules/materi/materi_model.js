const { STRING, UUIDV4, TEXT } = require("sequelize")
const sequelize = require("../../config/database")

const MateriModel = sequelize.define("materi", {
  id: {
    type: STRING,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  idJenisMateri: {
    type: STRING,
    allowNull: false,
  },
  nama: {
    type: STRING,
    allowNull: false,
  },
  intro: {
    type: STRING,
    allowNull: false,
  },
  videoFile: {
    type: STRING,
    allowNull: true,
  },
  content: {
    type: TEXT,
    allowNull: true,
  },
}, {
  freezeTableName: true,
})

module.exports = MateriModel
const { STRING, UUIDV4, TEXT, ENUM } = require("sequelize")
const sequelize = require("../../config/database")

const SoalModel = sequelize.define("soal", {
  id: {
    type: STRING,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  idJenisMateri:{
    type: STRING,
    allowNull: false,
  },
  idOpsiBenar:{
    type: STRING,
    allowNull: true,
  },
  idAttachment: {
    type: STRING,
    allowNull: true,
    defaultValue: null,
  },
  pertanyaan: {
    type: TEXT,
    allowNull: false,
  },
  tipe: {
    type: ENUM("test", "practice"),
    allowNull: false,
    validate: {
        isIn: {
        args: [["test", "practice"]],
        msg: "tipe hanya boleh test atau practice"
        } 
    }
 }
}, {
  freezeTableName: true,
})

module.exports = SoalModel

const { STRING, UUIDV4, TEXT } = require("sequelize")
const sequelize = require("../../config/database")

const AttachmentModel = sequelize.define("attachment", {
  id: {
    type: STRING,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  passage: {
    type: TEXT,
    allowNull: true,
  },
  audioFile: {
    type: STRING,
    allowNull: true,
  },
}, {
  freezeTableName: true,
})

module.exports = AttachmentModel
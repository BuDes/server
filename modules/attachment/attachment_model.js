const { STRING, UUIDV4 } = require("sequelize")
const sequelize = require("../../config/database")

const AttachmentModel = sequelize.define("attachment", {
  id: {
    type: STRING,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  passage: {
    type: STRING,
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
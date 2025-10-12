const { STRING, UUIDV4, TEXT } = require("sequelize")
const sequelize = require("../../config/database")
const bcrypt = require("bcrypt")
const saltRounds = parseInt(process.env.SALTROUNDS)

const MessageModel = sequelize.define("message", {
  id: {
    type: STRING,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  fromUserId: {
    type: STRING,
    allowNull: false,
  },
  toUserId: {
    type: STRING,
    allowNull: false,
  },
  content: {
    type: TEXT,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  hooks: {
    beforeCreate(user) {
      user.password = bcrypt.hashSync(user.password, saltRounds)
    }
  }
})

module.exports = MessageModel
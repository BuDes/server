const { STRING, UUIDV4, ENUM } = require("sequelize")
const sequelize = require("../../config/database")
const bcrypt = require("bcrypt")
const saltRounds = parseInt(process.env.SALTROUNDS)

const AdminModel = sequelize.define("admin", {
  id: {
    type: STRING,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: STRING,
    allowNull: false,
  },
  password: {
    type: STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  hooks: {
    beforeCreate(admin) {
      admin.password = bcrypt.hashSync(admin.password, saltRounds)
    }
  }
})

module.exports = AdminModel
const { STRING, UUIDV4 } = require("sequelize")
const sequelize = require("../../config/database")
const bcrypt = require("bcrypt")
const saltRounds = parseInt(process.env.SALTROUNDS)

const UserModel = sequelize.define("user", {
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
  email: {
    type: STRING,
    allowNull: false,
  },
  password: {
    type: STRING,
    allowNull: false,
  },
  token: {
    type: STRING,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  hooks: {
    beforeCreate(user) {
      user.password = bcrypt.hashSync(user.password, saltRounds)
    }
  }
})

module.exports = UserModel
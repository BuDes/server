const UserModel = require("./user_model")
const jwt = require("jsonwebtoken")
const secret = process.env.SECRET

class UserService {
  static async getByEmail(email) {
    const existingUser = await UserModel.findOne({
      where: { email }
    })
    return existingUser
  }

  static async createToken(id) {
    const user = await UserModel.findByPk(id)
    const token = jwt.sign({ id }, secret)
    return user.update({ token })
  }
}

module.exports = UserService
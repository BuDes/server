const jwt = require("jsonwebtoken")
const log = require("../utils/log")
const UserModel = require("../modules/user/user_model")
const secret = process.env.SECRET

async function authentication(req, res, next) {
  try {

    const bearer = req.headers.authorization
    if (bearer === undefined) throw new jwt.JsonWebTokenError("No headers found")
    const token = bearer.slice(7)
    
    const user = await UserModel.findOne({
      where: { token }
    })
    if (user === null) throw new jwt.JsonWebTokenError("User not found")
      
    const decode = jwt.verify(token, secret)
    req.idUser = decode.id
    next()

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      log.info(error.message)
      return res.status(401).json({
        status: false,
        message: "Anda belum login",
        data: null
      })
    }

    log.error(error.message)
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan, silahkan coba lagi",
      data: null
    })
  }
}

module.exports = authentication
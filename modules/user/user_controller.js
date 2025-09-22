const log = require("../../utils/log")
const UserModel = require("./user_model")
const UserService = require("./user_service")
const bcrypt = require("bcrypt")
const saltRounds = parseInt(process.env.SALTROUNDS)

class UserController {
  static async register(req, res) {
    try {
      const data = req.body
      
      const emailExists = await UserService.getByEmail(data.email)
      if (emailExists) {
        return res.status(409).json({
          status: false,
          message: "Email sudah terdaftar",
          data: null,
        })
      }
      
      let user = await UserModel.create(data)
      user = await UserService.createToken(user.id)

      return res.status(201).json({
        status: true,
        message: "Berhasil mendaftarkan user",
        data: user,
      })
    } catch (error) {
      log.error(error.message)
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: null,
      })
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body

      let user = await UserService.getByEmail(email)
      if (user === null) {
        return res.status(401).json({
          status: false,
          message: "Email belum terdaftar",
          data: null,
        })
      }

      const validation = bcrypt.compareSync(password, user.password)
      if (!validation) {
        return res.status(401).json({
          status: false,
          message: "Password yang Anda masukkan salah",
          data: null,
        })
      }

      user = await UserService.createToken(user.id)
      return res.status(200).json({
        status: true,
        message: "Berhasil login",
        data: user,
      })
    } catch (error) {
      log.error(error.message)
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: null,
      })
    }
  }

  static async logout(req, res) {
    try {
      const { idUser: id } = req
      await UserModel.update({ token: null }, { where: { id } })
      res.status(200).json({
        status: true,
        message: "Berhasil logout",
        data: null,
      })
    } catch (error) {
      log.error(error.message)
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: null,
      })
    }
  }

  static async allUser(req, res) {
    try {
      let user = await UserModel.findAll()
      res.status(200).json({
        status: true,
        message: "Berhasil mengambil semua user",
        data: user,
      })
    } catch (error) {
      log.error(error.message)
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: null,
      })
    }
  }

  static async profile(req, res) {
    try {
      const { idUser: id } = req
      let user = await UserModel.findByPk(id, {
        include: ["riwayat"]
      })
      res.status(200).json({
        status: true,
        message: "Berhasil mengambil profil",
        data: user,
      })
    } catch (error) {
      log.error(error.message)
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: null,
      })
    }
  }

  static async updateProfile(req, res) {
    try {
      const { idUser } = req
      const data = req.body
      if (data.password) delete data.password
      let user = await UserModel.findByPk(idUser)

      const existingEmail = await UserService.getByEmail(data.email)
      if (data.email !== user.email && existingEmail) {
        return res.status(409).json({
          status: false,
          message: "Email sudah terdaftar",
          data: null,
        })
      }

      await user.update(data)
      user = await UserModel.findByPk(user.id)

      return res.status(200).json({
        status: true,
        message: "Berhasil update profil",
        data: user,
      })
    } catch (error) {
      log.error(error.message)
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: null,
      })
    }
  }

  static async updatePassword(req, res) {
    try {
      const { idUser } = req
      const { passwordLama, passwordBaru } = req.body
      const user = await UserModel.findByPk(idUser)

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
          data: null,
        })
      }

      const validation = bcrypt.compareSync(passwordLama, user.password)
      if (!validation) {
        return res.status(401).json({
          status: false,
          message: "Password lama salah",
          data: null,
        })
      }

      const password = bcrypt.hashSync(passwordBaru, saltRounds)
      await user.update({ password })

      return res.status(200).json({
        status: true,
        message: "Password berhasil diubah",
        data: null,
      })
    } catch (error) {
      log.error(error.message)
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: null,
      })
    }
  }

  static async removeUser(req, res) {
    try {
      const { id } = req.params
      const count = await UserModel.destroy({ where: { id } })

      if (count === 0) {
        return res.status(404).json({
          status: false,
          message: "User tidak ditemukan",
          data: null,
        })
      }

      return res.status(200).json({
        status: true,
        message: "Berhasil menghapus user",
        data: null,
      })
    } catch (error) {
      log.error(error.message)
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: null,
      })
    }
  }
}

module.exports = UserController
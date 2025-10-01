const log = require("../../utils/log")
const JadwalTestModel = require("../jadwal_test/jadwal_test_model")
const AdminModel = require("./admin_model")
const bcrypt = require("bcrypt")
const AdminService = require("./admin_service")
const saltRounds = parseInt(process.env.SALTROUNDS)

class AdminController {
  static async register(req, res) {
    try {
      const data = req.body
      
      let admin = await AdminModel.create(data)

      return res.status(201).json({
        status: true,
        message: "Berhasil mendaftarkan admin",
        data: admin,
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
      const { username, password } = req.body

      let admin = await AdminModel.findOne({
        where: { username }
      }
      )
      if (admin === null) {
        return res.status(401).json({
          status: false,
          message: "Username belum terdaftar",
          data: null,
        })
      }

      const validation = bcrypt.compareSync(password, admin.password)
      if (!validation) {
        return res.status(401).json({
          status: false,
          message: "Password yang Anda masukkan salah",
          data: null,
        })
      }

      // admin = await AdminService.createToken(admin.id)
      return res.status(200).json({
        status: true,
        message: "Berhasil login",
        data: admin,
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

  static async getAdmin(req, res) {
    try {
      let admin = await AdminModel.findAll()
      res.status(200).json({
        status: true,
        message: "Berhasil mengambil admin",
        data: admin,
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

  static async dashboard(req, res) {
    try {
      const totalTest = await JadwalTestModel.count()
      const totalMonthlyTest = await AdminService.getTotalMonthlyTest()
      const { top5, totalUpcoming } = await AdminService.getUpcomingTest()
      return res.status(200).json({
        status: true,
        message: "Berhasil mengambil data dashboard",
        data: {
          totalTest,
          totalMonthlyTest,
          upcoming: { top5, totalUpcoming }
        },
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

module.exports = AdminController
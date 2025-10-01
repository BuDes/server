const log = require("../../utils/log")
const RiwayatModel = require("../riwayat/riwayat_model")
const UserModel = require("../user/user_model")
const JadwalTestModel = require("./jadwal_test_model")
const JadwalTestService = require("./jadwal_test_service")

class JadwalTestController{
  static async allJadwalTest(req, res) {
    try {
    const jadwalTest = await JadwalTestModel.findAll()
    return res.status(200).json({
        status: true,
        message: "Berhasil mengambil semua jadwal test",
        data: jadwalTest,
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

  static async jadwalByUser(req, res) {
    try {
    const { idUser: id } = req
    
    const userWithJadwal = await UserModel.findByPk(id, {
    include: [
        {model: RiwayatModel, as:"riwayat", attributes: ["idJadwalTest"],
        include: ["jadwal_test"]}
    ]
    })
    
    return res.status(200).json({
    status: true,
    message: "Berhasil mengambil detail jadwal test",
    data: userWithJadwal,
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

  static async addJadwalTest(req, res) {
    try {
        const data = req.body
        const jadwalTest = await JadwalTestModel.create(data)
        return res.status(201).json({
        status: true,
        message: "Berhasil menambahkan jadwal test",
        data: jadwalTest,
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

  static async updateJadwalTest(req, res) {
    try {
    const { id } = req.params
    const data = req.body
    if (data.id) delete data.id
    
    const jadwalTest = await JadwalTestModel.findByPk(id)

    if (jadwalTest === null) {
    return res.status(404).json({
        status: false,
        message: "jadwal tidak ditemukan",
        data: null,
    })
    }

    await jadwalTest.update(data)
    return res.status(200).json({
    status: true,
    message: "Berhasil memperbarui jadwal",
    data: jadwalTest,
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

  static async removeJadwalTest(req, res) {
    try {
        const { id } = req.params
        const jadwalTest = await JadwalTestModel.findByPk(id)

        if (jadwalTest === null) {
        return res.status(404).json({
            status: false,
            message: "jadwal tidak ditemukan",
            data: null,
        })
        }

        await jadwalTest.destroy()
        return res.status(200).json({
        status: true,
        message: "Berhasil menghapus jadwal test",
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

  static async sortedJadwal(req, res) {
    try {
      const upcoming = await JadwalTestService.getUpcomingTest()
      const pastTest = await JadwalTestService.getPastTest()
      const jadwal = [...upcoming, ...pastTest]
      return res.status(200).json({
        status: true,
        message: "Berhasil mengambil data jadwal",
        data: jadwal,
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

  static async detailJadwal(req, res) {
    try {
      const { id } = req.params
      let jadwal = await JadwalTestModel.findByPk(id, {
        include: [{
          association: "peserta",
          include: ["user"]
        }]
      })
      jadwal = JadwalTestService.parseStatus(jadwal)
      return res.status(200).json({
        status: true,
        message: "Berhasil mengambil detail jadwal test",
        data: jadwal,
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

module.exports = JadwalTestController
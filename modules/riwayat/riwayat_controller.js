const log = require("../../utils/log")
const RiwayatModel = require("../riwayat/riwayat_model")
const RiwayatService = require("./riwayat_service")

class RiwayatController{
  static async myRiwayat(req, res) {
    try {
      const { idUser } = req
      
      const riwayat = await RiwayatModel.findAll({
        where: { idUser },
        order: [["createdAt", "DESC"]],
        include: ["materi", "jadwal_test"]
      })
      
      return res.status(200).json({
        status: true,
        message: "Berhasil mengambil semua riwayat",
        data: riwayat,
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

  static async addRiwayat(req, res) {
    try {
        const data = req.body
        const { idUser } = req
        const riwayat = await RiwayatModel.create({ ...data, idUser })
        return res.status(201).json({
        status: true,
        message: "Berhasil menambahkan jadwal test",
        data: riwayat,
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

  static async updateriwayat(req, res) {
    try {
    const { id } = req.params
    const data = req.body
    if (data.id) delete data.id
    
    const riwayat = await RiwayatModel.findByPk(id)

    if (riwayat === null) {
    return res.status(404).json({
        status: false,
        message: "Riwayat tidak ditemukan",
        data: null,
    })
    }

    await riwayat.update(data)
    return res.status(200).json({
    status: true,
    message: "Berhasil memperbarui riwayat",
    data: riwayat,
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

  static async removeriwayat(req, res) {
    try {
        const { id } = req.params
        const riwayat = await RiwayatModel.findByPk(id)

        if (riwayat === null) {
        return res.status(404).json({
            status: false,
            message: "riwayat tidak ditemukan",
            data: null,
        })
        }

        await riwayat.destroy()
        return res.status(200).json({
        status: true,
        message: "Berhasil menghapus riwayat",
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

  static async submitAnswers(req, res) {
    try {
      const { idUser } = req
      const data = req.body
      const riwayat = await RiwayatModel.create({ ...data, idUser }, {
        include: ["jawaban"]
      })
      return res.status(201).json({
        status: true,
        message: "Berhasil submit practice test",
        data: riwayat,
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

  static async hasilPracticeTest(req, res) {
    try {
      const { idUser } = req
      const jawaban = await RiwayatService.getLatestJawaban(idUser)
      const parsedJawaban = RiwayatService.parseHasilJawaban(jawaban)
      return res.status(200).json({
        status: true,
        message: "Berhasil mengambil hasil practice",
        data: parsedJawaban,
      })
    } catch (error) {
      log.error(error)
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: null,
      })
    }
  }

  static async hasilTest(req, res) {
    try {
      const { idUser } = req
      const { idJadwal } = req.params
      const jawaban = await RiwayatService.getJawabanTest(idJadwal, idUser)
      const parsedJawaban = RiwayatService.parseHasilJawaban(jawaban)
      return res.status(200).json({
        status: true,
        message: "Berhasil mengambil hasil test",
        data: parsedJawaban,
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

module.exports = RiwayatController
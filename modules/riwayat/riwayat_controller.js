const log = require("../../utils/log")
const RiwayatModel = require("../riwayat/riwayat_model")
const UserModel = require("../user/user_model")

class RiwayatController{
  static async allRiwayat(req, res) {
    try {
    const jadwalTest = await RiwayatModel.findAll()
    return res.status(200).json({
        status: true,
        message: "Berhasil mengambil semua riwayat",
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

  static async addRiwayat(req, res) {
    try {
        const data = req.body
        const riwayat = await RiwayatModel.create(data)
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

}

module.exports = RiwayatController
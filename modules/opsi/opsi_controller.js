const log = require("../../utils/log")
const OpsiModel = require("../riwayat/riwayat_model")
const UserModel = require("../user/user_model")

class OpsiController{
  static async allOpsi(req, res) {
    try {
    const opsi = await OpsiModel.findAll()
    return res.status(200).json({
        status: true,
        message: "Berhasil mengambil semua opsi",
        data: opsi,
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

  static async addOpsi(req, res) {
    try {
        const data = req.body
        const opsi = await OpsiModel.create(data)
        return res.status(201).json({
        status: true,
        message: "Berhasil menambahkan jadwal opsi",
        data: opsi,
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

  static async updateOpsi(req, res) {
    try {
    const { id } = req.params
    const data = req.body
    if (data.id) delete data.id
    
    const Opsi = await OpsiModel.findByPk(id)

    if (Opsi === null) {
    return res.status(404).json({
        status: false,
        message: "Opsi tidak ditemukan",
        data: null,
    })
    }

    await Opsi.update(data)
    return res.status(200).json({
    status: true,
    message: "Berhasil memperbarui Opsi",
    data: Opsi,
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

  static async removeOpsi(req, res) {
    try {
        const { id } = req.params
        const opsi = await OpsiModel.findByPk(id)

        if (opsipsi === null) {
        return res.status(404).json({
            status: false,
            message: "Opsi tidak ditemukan",
            data: null,
        })
        }

        await opsipsi.destroy()
        return res.status(200).json({
        status: true,
        message: "Berhasil menghapus Opsi",
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

module.exports = OpsiController
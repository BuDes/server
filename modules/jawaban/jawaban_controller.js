const log = require("../../utils/log")
const RiwayatModel = require("../riwayat/riwayat_model")
const OpsiModel = require("../soal&opsi/opsi_model")
const UserModel = require("../user/user_model")
const JawabanModel = require("./jawaban_model")

class JawabanController{
  static async allJawabanByUser(req, res) {
    try {
    const { idUser: id } = req
    const userWithJawaban = await UserModel.findByPk(id, {
    include: [
        {model: JawabanModel, as:"jawaban", attributes: ["idOpsi"],
        include: ["opsi"]
        }
    ]
    })
    
    return res.status(200).json({
        status: true,
        message: "Berhasil mengambil semua jawaban sesuai user",
        data: userWithJawaban,
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
        {model: RiwayatModel, as:"riwayat", attributes: ["idjawaban"],
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

  static async addJawaban(req, res) {
    try {
        const data = req.body
        data.idUser = req.idUser
        const jawaban = await JawabanModel.create(data)
        return res.status(201).json({
        status: true,
        message: "Berhasil menambahkan jadwal test",
        data: jawaban,
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

  static async updateJawaban(req, res) {
    try {
    const { id } = req.params
    const idUser = req.idUser;
    const data = req.body
    delete data.id;
    delete data.idUser;
    
    const jawaban = await JawabanModel.findOne({ where: { idUser, id } });

    if (jawaban === null) {
    return res.status(404).json({
        status: false,
        message: "jawaban bukan milik anda atau jawaban tidak ditemukan",
        data: null,
    })
    }
    if (data.idOpsi) {
      const opsi = await OpsiModel.findByPk(data.idOpsi);
      if (!opsi) {
        return res.status(400).json({
          status: false,
          message: "Opsi tidak ditemukan",
          data: null,
        });
      }
    }

    await jawaban.update(data)
    return res.status(200).json({
    status: true,
    message: "Berhasil memperbarui jawaban",
    data: jawaban,
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

  static async removeJawaban(req, res) {
    try {
        const { id } = req.params
        const idUser = req.idUser;
        const jawaban = await JawabanModel.findOne({ where: { idUser, id } });

        if (jawaban === null) {
        return res.status(404).json({
            status: false,
            message: "jawaban bukan milik anda atau jawaban tidak ditemukan",
            data: null,
        })
        }

        await jawaban.destroy()
        return res.status(200).json({
        status: true,
        message: "Berhasil menghapus jawaban sesuai user",
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

module.exports = JawabanController
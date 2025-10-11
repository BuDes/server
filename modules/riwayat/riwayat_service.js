const RiwayatModel = require("./riwayat_model")

class RiwayatService {
  static async getLatestJawaban(idUser) {
    const riwayat = await RiwayatModel.findOne({
      order: [["createdAt", "DESC"]],
      where: { idUser },
      include: [{
        association: "jawaban",
        include: [{
          association: "opsi",
          include: [{
            association: "soal",
            include: ["opsi"]
          }]
        }]
      }]
    })
    return riwayat.jawaban
  }

  static async getJawabanTest(idJadwal, idUser) {
    const riwayat = await RiwayatModel.findOne({
      where: { idUser, idJadwal },
      include: [{
        association: "jawaban",
        include: [{
          association: "opsi",
          include: [{
            association: "soal",
            include: ["opsi"]
          }]
        }]
      }]
    })
    return riwayat.jawaban
  }

  static parseHasilJawaban(listJawaban) {
    return listJawaban.map((jawaban) => {
      const { soal } = jawaban.opsi.get()
      return { ...jawaban.get(), ...soal.get() }
    })
  }
}

module.exports = RiwayatService
const RiwayatModel = require("./riwayat_model")

class RiwayatService {
  static async getLatestJawaban(idUser) {
    const riwayat = await RiwayatModel.findOne({
      order: [["createdAt", "DESC"]],
      where: { idUser },
      include: [{
        association: "jawaban",
        include: [
          {
            association: "opsi",
            include: [{
              association: "soal",
              include: ["opsi"]
            }]
          },
          {
            association: "soal",
            include: ["opsi"]
          },
        ]
      }]
    })
    return riwayat.jawaban
  }

  static async getJawabanTest(idJadwal, idUser) {
    const riwayat = await RiwayatModel.findOne({
      where: { idUser, idJadwal },
      include: [{
        association: "jawaban",
        include: [
          {
            association: "opsi",
            include: [{
              association: "soal",
              include: ["opsi"]
            }]
          },
          {
            association: "soal",
            include: ["opsi"]
          },
        ]
      }]
    })
    return riwayat.jawaban
  }

  static parseHasilJawaban(listJawaban) {
    return listJawaban.map((jawaban) => {
      jawaban = jawaban.get()
      const opsi = jawaban.opsi?.get()
      const soal = opsi ? opsi.soal : jawaban.soal
      delete jawaban.soal
      return { ...jawaban, ...soal.get() }
    })
  }
}

module.exports = RiwayatService
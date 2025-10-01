const { Op } = require("sequelize")
const JadwalTestModel = require("./jadwal_test_model")

class JadwalTestService {
  static getUpcomingTest = async () => {
    const now = new Date()
    let upcoming = await JadwalTestModel.findAll({
      where: { tanggal: { [Op.gte]: now } },
      order: [["tanggal", "ASC"]],
      include: ["peserta"],
    })
    upcoming = upcoming.map((e) => this.parseTest(e, "Terjadwal"))
    return upcoming
  }

  static getPastTest = async () => {
    const now = new Date()
    let pastTest = await JadwalTestModel.findAll({
      where: { tanggal: { [Op.lt]: now } },
      order: [["tanggal", "DESC"]],
      include: ["peserta"],
    })
    pastTest = pastTest.map((e) => this.parseTest(e, "Selesai"))
    return pastTest
  }

  static parseTest(jadwal, status) {
    jadwal = jadwal.get()
    const jlhPeserta = jadwal.peserta.length
    delete jadwal.peserta
    return { ...jadwal, status, jlhPeserta }
  }

  static parseStatus(jadwal) {
    const now = new Date()
    const tanggal = new Date(jadwal.tanggal)
    const status = tanggal >= now ? "Terjadwal" : "Selesai"
    return { ...jadwal.get(), status }
  }
}

module.exports = JadwalTestService
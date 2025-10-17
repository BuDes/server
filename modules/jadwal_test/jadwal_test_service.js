const { Op } = require("sequelize")
const JadwalTestModel = require("./jadwal_test_model")
const RiwayatModel = require("../riwayat/riwayat_model")
const { toleransiTest } = require("../../utils/constants")

class JadwalTestService {
  static getUpcomingTest = async () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - toleransiTest)
    let upcoming = await JadwalTestModel.findAll({
      where: { tanggal: { [Op.gte]: now } },
      order: [["tanggal", "ASC"]],
      include: ["peserta"],
    })
    upcoming = upcoming.map((e) => this.parseTest(e, "Terjadwal"))
    return upcoming
  }

  static async getUserUpcomingTests(idUser) {
    const now = new Date()
    now.setMinutes(now.getMinutes() - toleransiTest)
    const riwayat = await RiwayatModel.findAll({
      attributes: ["idJadwalTest"],
      where: {
        idUser,
        idJadwalTest: { [Op.not]: null }
      }
    })
    const riwayatIds = riwayat.map((e) => e.idJadwalTest)
    const upcoming = await JadwalTestModel.findAll({
      where: {
        tanggal: { [Op.gte]: now },
        id: { [Op.not]: riwayatIds }
      },
      include: [{
        association: "peserta",
        where: { idUser },
        attributes: []
      }],
      order: [["tanggal", "ASC"]],
    })
    return upcoming
  }

  static async getUserUnregisteredTests(idUser) {
    const now = new Date()
    now.setMinutes(now.getMinutes() - toleransiTest)
    const upcoming = await JadwalTestModel.findAll({
      where: {
        tanggal: { [Op.gte]: now },
      },
      include: ["peserta"]
    })
    const unregistered = upcoming.filter((e) => {
      return e.peserta.every((peserta) => {
        return peserta.idUser !== idUser
      })
    })
    return unregistered
  }

  static getPastTest = async () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - toleransiTest)
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
    now.setMinutes(now.getMinutes() - toleransiTest)
    const tanggal = new Date(jadwal.tanggal)
    const status = tanggal >= now ? "Terjadwal" : "Selesai"
    return { ...jadwal.get(), status }
  }
}

module.exports = JadwalTestService
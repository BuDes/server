const { Op} = require("sequelize");
const JadwalTestModel = require("../jadwal_test/jadwal_test_model");

class AdminService {
  static getMonthRange() {
    const bulanIni = new Date();
    const firstDay = new Date(bulanIni.getFullYear(), bulanIni.getMonth(), 1);
    const lastDay = new Date(bulanIni.getFullYear(), bulanIni.getMonth() + 1, 0);
    return { firstDay, lastDay }
  }

  static getTotalMonthlyTest = async () => {
    const { firstDay, lastDay } = this.getMonthRange()
    const count = await JadwalTestModel.count({
      where: {
        tanggal: { [Op.between]: [firstDay, lastDay] }
      }
    })
    return count
  }

  static async getUpcomingTest() {
    const now = new Date()
    let top5 = await JadwalTestModel.findAll({
      where: { tanggal: { [Op.gte]: now } },
      order: [["tanggal", "ASC"]],
      limit: 5,
      include: ["peserta"],
    })
    top5 = top5.map((jadwal) => {
      jadwal = jadwal.get()
      const  jlhPeserta = jadwal.peserta.length
      delete jadwal.peserta
      return { ...jadwal, jlhPeserta }
    })
    const totalUpcoming = await JadwalTestModel.count({
      where: { tanggal: { [Op.gt]: now } },
    })
    return { top5, totalUpcoming }
  }
}

module.exports = AdminService
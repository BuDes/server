const sequelize = require("../../config/database")
const JenisMateriModel = require("../jenis_materi/jenis_materi_model")
const SoalModel = require("./soal_model")

class SoalService {
  static async getRandomSoal() {
    const listJenis = await JenisMateriModel.findAll({ raw: true })
    const promises = listJenis.map(async (jenis) => {
      const limit = jenis.jlhSoal

      const randomIds = await SoalModel.findAll({
        attributes: ["id"],
        where: { idJenisMateri: jenis.id },
        order: sequelize.random(),
        limit,
      })
      const ids = randomIds.map((e) => e.id)
      const randomSoal = await SoalModel.findAll({
        where: { id: ids }
      })
      const soal = randomSoal.map((e) => e.get())

      return { ...jenis, soal }
    })

    return await Promise.all(promises)
  }
}

module.exports = SoalService
// controllers/nilaiController.js
const SoalModel = require("../soal&opsi/soal_model");
const JawabanModel = require("../jawaban/jawaban_model");
const OpsiModel = require("../soal&opsi/opsi_model");

class NilaiController{
static async getNilaiByType(req, res, tipe) {
  try {
    const { idUser } = req
    const { tipe } = req.params

    const soalList = await SoalModel.findAll({
      where: { tipe },
      include: [ "jawaban_benar" ]
    });

    if (!soalList || soalList.length === 0) {
      return res.status(404).json({ message: `Soal ${tipe} tidak ditemukan` });
    }

    const soalIds = soalList.map((s) => s.id);

    const jawabanUser = await JawabanModel.findAll({
      where: { idUser },
      include: [ "opsi" ]
    });

    const jawabanFilter = jawabanUser.filter(j => 
      soalIds.includes(j.opsi.idSoal)
    );

    let benar = 0;

    jawabanFilter.forEach(j => {
      const soal = soalList.find(s => s.id === j.opsi.idSoal);
      if (soal && soal.idOpsiBenar === j.idOpsi) {
        benar++;
      }
    });

    const totalSoal = soalList.length;
    const nilaiPersen = totalSoal > 0 ? (benar / totalSoal) * 100 : 0;

    return res.json({
      tipe,
      totalSoal,
      jumlahBenar: benar,
      nilai: `${nilaiPersen.toFixed(2)}%`
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server", error });
  }
}

}

module.exports = NilaiController
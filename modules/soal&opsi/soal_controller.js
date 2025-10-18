const log = require("../../utils/log")
const getUrl = require("../../utils/get_url")
const fs = require('fs')
const path = require('path')
const SoalModel = require("./soal_model")
const JadwalTestModel = require("../jadwal_test/jadwal_test_model")
const OpsiModel = require("./opsi_model")
const JenisMateriModel = require("../jenis_materi/jenis_materi_model")
const SoalService = require("./soal_service")
const AttachmentModel = require("../attachment/attachment_model")

class SoalController {
  static async allSoal(req, res) {
      try {
      const soal = await SoalModel.findAll({
        include: ["jadwal_test", {model: OpsiModel, as: "jawaban_benar", attributes: ["id", "isi"]},
         {model: OpsiModel, as: "opsi", attributes: ["id", "isi"]}],
        order: [["tipe", "ASC"], ["createdAt", "DESC"]]
      })
      return res.status(200).json({
          status: true,
          message: "Berhasil mengambil semua soal",
          data: soal,
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

  static async allSoalTipe(req, res) {
    try {
      const { tipe } = req.params;
      const soal = await SoalModel.findAll({
        where: { tipe },
         include: ["jadwal_test", {model: OpsiModel, as: "jawaban_benar", attributes: ["id", "isi"]},
         {model: OpsiModel, as: "opsi", attributes: ["id", "isi"]}],
      })
      return res.status(200).json({
        status: true,
        message: `Berhasil mengambil semua soal dengan tipe ${tipe}`,
        data: soal,
      });
    } catch (error) {
      log.error(error.message);
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: null,
      });
    }
  }


  // static async soalByidJadwal(req, res) {
  // try {
  //     const { id } = req.params
      
  //     const soal = await JadwalTestModel.findByPk(id, {
  //     include: ["soal"]})
  //     return res.status(200).json({
  //     status: true,
  //     message: "Berhasil mengambil soal sesuai jadwal",
  //     data: soal,
  //     })
  // } catch (error) {
  //     log.error(error.message)
  //     return res.status(500).json({
  //     status: false,
  //     message: "Terjadi kesalahan, silahkan coba lagi",
  //     data: null,
  //     })
  // }
  // }

  static async practiceTest(req, res) {
    try {
      const url = getUrl(req)
      let randomSoal = await SoalService.getRandomSoal("practice")
      randomSoal = SoalService.parseAudio(randomSoal, url)
      return res.status(200).json({
        status: true,
        message: "Berhasil mengambil soal",
        data: randomSoal,
      })
    } catch (error) {
      log.error(error)
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: null,
      })
    }
  }

  static async realTest(req, res) {
    try {
      const url = getUrl(req)
      let randomSoal = await SoalService.getRandomSoal("test")
      randomSoal = SoalService.parseAudio(randomSoal, url)
      return res.status(200).json({
        status: true,
        message: "Berhasil mengambil soal",
        data: randomSoal,
      })
    } catch (error) {
      log.error(error)
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silahkan coba lagi",
        data: null,
      })
    }
  }

  static async addSoal(req, res) {
  try {
    const data = req.body
    if (req.files === null) return res.status(400).json({ message: "No File Uploaded" })
    const file = req.files.file
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    const fileName = file.md5 + ext
    const url = getUrl(req)
    const audioFile = `${url}/public/audioFile/${fileName}`
    const allowedType = ['.aac', '.mp3', '.wav']
    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ message: "Invalid File" })
    if (fileSize > 100 * 1024 * 1024) return res.status(422).json({ message: "File must be less than 100 MB" })
    file.mv(`./public/audioFile/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ message: err.message })
      try {
          const jenisData = {
              ...data,
              audioFile: audioFile
          }
          const soal = await SoalModel.create(jenisData)
          const opsiKeys = Object.keys(data).filter(k => k.startsWith("opsi["))
          const opsi = opsiKeys.map(k => data[k])

        // Simpan opsi ke DB
        let opsiSaved = []
        if (opsi.length > 0) {
          const opsiData = opsi.map((isi) => ({
            idSoal: soal.id,
            isi
          }))
          opsiSaved = await OpsiModel.bulkCreate(opsiData, { returning: true })
        }

          if (data.jawabanIndex !== undefined && opsiSaved[data.jawabanIndex]) {
          soal.idOpsiBenar = opsiSaved[data.jawabanIndex].id;
          await soal.save();
          }
          return res.status(201).json({
              status: true,
              message: "Berhasil menambahkan soal",
              data: soal,
              opsi: opsiSaved
          });
        } catch (error) {
          log.error(error.message)
          return res.status(500).json({
              status: false,
              message: "Terjadi kesalahan saat menyimpan data",
              data: null,
          })
      }
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

// static async addManySoal(req, res) {
//   try {
//     const soalArray = []

//     for (const [key, value] of Object.entries(req.body)) {
//       const match = key.match(/^soal\[(\d+)\]\[(.+)\]$/)
//       if (match) {
//         const index = parseInt(match[1], 10)
//         const field = match[2]
//         if (!soalArray[index]) soalArray[index] = {}
//         soalArray[index][field] = value
//       }
//     }

//     if (!soalArray.length) {
//       return res.status(400).json({ msg: "Soal tidak ditemukan dalam request" })
//     }

//     let hasilSoal = []

//     for (let i = 0; i < soalArray.length; i++) {
//       const s = soalArray[i]

//       let audioFile = null
//       if (req.files && req.files[`soal[${i}][file]`]) {
//         const file = req.files[`soal[${i}][file]`]
//         const fileSize = file.data.length
//         const ext = path.extname(file.name)
//         const fileName = file.md5 + ext
//         const url = getUrl(req)
//         audioFile = `${url}/public/audioFile/${fileName}`

//         const allowedType = [".aac", ".mp3", ".wav"]
//         if (!allowedType.includes(ext.toLowerCase())) {
//           return res.status(422).json({ msg: `File soal[${i}] invalid` })
//         }
//         if (fileSize > 100 * 1024 * 1024) {
//           return res.status(422).json({ msg: `File soal[${i}] lebih dari 100MB` })
//         }

//         await new Promise((resolve, reject) => {
//           file.mv(`./public/audioFile/${fileName}`, (err) => {
//             if (err) reject(err)
//             else resolve()
//           })
//         })
//       }

//       const soal = await SoalModel.create({
//         idJadwalTest: s.idJadwalTest,
//         idJenisMateri: s.idJenisMateri,
//         pertanyaan: s.pertanyaan,
//         tipe: s.tipe,
//         audioFile
//       })

//       const opsiKeys = Object.keys(s).filter(k => k.startsWith("opsi["))
//       const opsi = opsiKeys.map(k => s[k])

//       let opsiSaved = []
//       if (opsi.length > 0) {
//         const opsiData = opsi.map((isi) => ({
//           idSoal: soal.id,
//           isi
//         }))
//         opsiSaved = await OpsiModel.bulkCreate(opsiData, { returning: true })
//       }

//       if (s.jawabanIndex !== undefined && opsiSaved[s.jawabanIndex]) {
//         soal.idOpsiBenar = opsiSaved[s.jawabanIndex].id
//         await soal.save()
//       }

//       hasilSoal.push({
//         soal,
//         opsi: opsiSaved
//       })
//     }

//     return res.status(201).json({
//       status: true,
//       message: "Berhasil menambahkan banyak soal",
//       data: hasilSoal
//     })

//   } catch (error) {
//     console.error(error.message)
//     return res.status(500).json({
//       status: false,
//       message: "Terjadi kesalahan saat menyimpan data",
//       data: null
//     })
//   }
// }

static async addMany(req, res) {
  try {
    // the JSON array (as string) from form-data field named "data"
    const soalArray = JSON.parse(req.body.data);

    // const savedSoals = [];
    for (const item of soalArray) {
      let audioFileName = null;

      // handle optional audio file (field name should match item.id or something unique)
      if (req.files && item.audioFile && req.files[item.audioFile]) {
        const audio = req.files[item.audioFile];
        const uploadDir = path.join("public", "audioFile");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        audioFileName = `${Date.now()}-${audio.name}`;
        item.audioFile = audioFileName
        const uploadPath = path.join(uploadDir, audioFileName);
        await audio.mv(uploadPath);
      }

      // create soal
      const { idOpsiBenar } = item
      delete item.idOpsiBenar
      const soal = await SoalModel.create(item, {
        include: ["opsi"]
      });
      await soal.update({ idOpsiBenar })

      // create opsi
      // const opsiData = item.opsi.map((o) => ({
      //   id: o.id,
      //   idSoal: soal.id,
      //   isi: o.isi,
      // }));
      // await OpsiModel.bulkCreate(opsiData);

      // savedSoals.push({
      //   soal,
      //   opsi: opsiData,
      // });
    }

    return res.status(201).json({
      status: true,
      message: "Soal dan opsi berhasil disimpan",
      data: [],
    });
  } catch (error) {
    log.error(error)
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan, silahkan coba lagi",
      data: null,
    })
  }
}


static async updateSoal(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    if (data.id) delete data.id;
    const soal = await SoalModel.findByPk(id);

    if (soal === null) {
      return res.status(404).json({
        status: false,
        message: "soal tidak ditemukan",
        data: null,
      });
    }

    // let audioFile = soal.audioFile;
    // if (req.files && req.files.file) {
    //   const file = req.files.file;
    //   const fileSize = file.data.length;
    //   const ext = path.extname(file.name);
    //   const fileName = file.md5 + ext;
    //   const url = getUrl(req)
    //   audioFile = `${url}/public/audioFile/${fileName}`;
    //   const allowedType = ['.aac', '.mp3', '.wav'];

    //   if (!allowedType.includes(ext.toLowerCase())) {
    //     return res.status(422).json({ message: "Invalid file" });
    //   }
    //     if (fileSize > 100 * 1024 * 1024) return res.status(422).json({ message: "Audio must be less than 100 MB" })
    //   if (soal.audioFile) {
    //   const oldFile = `./public/audioFile/${soal.audioFile.split("/").pop()}`;
    //   if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
    //   }

    //   await file.mv(`./public/audioFile/${fileName}`);
    // }
    await soal.update({
      ...data,
      // audioFile: audioFile
    });
    const opsiKeys = Object.keys(data).filter(k => k.startsWith("opsi["));
    let opsiSaved = []
    if (opsiKeys.length > 0) {
      await OpsiModel.destroy({ where: { idSoal: soal.id } });
      const opsi = opsiKeys.map(k => data[k]);
      const opsiData = opsi.map((isi) => ({
        idSoal: soal.id,
        isi
      }));
      opsiSaved = await OpsiModel.bulkCreate(opsiData, { returning: true });
      if (data.jawabanIndex !== undefined && opsiSaved[data.jawabanIndex]) {
        soal.idOpsiBenar = opsiSaved[data.jawabanIndex].id;
        await soal.save();
      }
    }
    return res.status(200).json({
      status: true,
      message: "Berhasil memperbarui soal soal",
      data: soal,
      opsi: opsiSaved
    });
  } catch (error) {
    log.error(error.message);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan, silahkan coba lagi",
      data: null,
    });
  }
}

static async removeSoal(req, res) {
  try {
    const { id } = req.params;

    const soal = await SoalModel.findByPk(id);
    if (!soal) {
      return res.status(404).json({
        status: false,
        message: "soal soal tidak ditemukan",
        data: null,
      });
    }
    if (soal.audioFile) {
      const oldFile = `./public/audioFile/${soal.audioFile.split("/").pop()}`;
      if (fs.existsSync(oldFile)) {
        fs.unlinkSync(oldFile);
      }
    }
    await OpsiModel.destroy({
      where: { idSoal: soal.id }
    });
    await soal.destroy();
    return res.status(200).json({
      status: true,
      message: "Berhasil menghapus soal soal",
      data: null,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan, silakan coba lagi",
      data: null,
    });
    }
  }

  static async soalByJenis(req, res) {
    try {
      const { idJenis: idJenisMateri } = req.params
      const jenis = await JenisMateriModel.findByPk(idJenisMateri)
      const soal = await SoalModel.findAll({
        where: { idJenisMateri },
        order: [["createdAt", "DESC"]]
      })
      return res.status(200).json({
        status: true,
        message: "Berhasil mengambil data soal dari jenis",
        data: { jenis, soal },
      })
    } catch (error) {
      log.error(error.message);
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silakan coba lagi",
        data: null,
      })
    }
  }

  static async detailSoal(req, res) {
    try {
      const { id } = req.params
      const soal = await SoalModel.findByPk(id, {
        include: ["opsi"]
      })
      const attachments = await AttachmentModel.findAll()
      return res.status(200).json({
        status: true,
        message: "Berhasil mengambil detail soal",
        data: { soal, attachments },
      })
    } catch (error) {
      log.error(error.message);
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silakan coba lagi",
        data: null,
      })
    }
  }
}

module.exports = SoalController
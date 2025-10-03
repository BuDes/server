const log = require("../../utils/log")
const getUrl = require("../../utils/get_url")
const fs = require('fs')
const path = require('path')
const { Op } = require('sequelize');
const MateriModel = require("./materi_model")
const JenisMateriModel = require("../jenis_materi/jenis_materi_model");

    class MateriController{
    static async allMateri(req, res) {
        try {
        const materi = await MateriModel.findAll({
           include: ["jenis_materi"]
        })
        return res.status(200).json({
            status: true,
            message: "Berhasil mengambil materi",
            data: materi,
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

    static async materiByIdJenis(req, res) {
    try {
        const { id } = req.params
        
        const materi = await JenisMateriModel.findByPk(id, {
        include: ["materi"]})
        return res.status(200).json({
        status: true,
        message: "Berhasil mengambil materi sesuai jenis",
        data: materi,
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

    static async addMateri(req, res) {
    try {
      const data = req.body
      if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" })
      const file = req.files.file
      const fileSize = file.data.length
      const ext = path.extname(file.name)
      const fileName = file.md5 + ext
      const url = getUrl(req)
      const videoFile = `${url}/public/videoFile/${fileName}`
      const allowedType = ['.mp4', '.mkv', '.avi', '.mov', '.webm']
      if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Image" })
      if (fileSize > 100 * 1024 * 1024) return res.status(422).json({ msg: "Video must be less than 100 MB" })
      file.mv(`./public/videoFile/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message })
        try {
            const jenisData = {
                ...data,
                videoFile: videoFile
            }
            const materi = await MateriModel.create(jenisData)
            return res.status(201).json({
                status: true,
                message: "Berhasil menambahkan materi",
                data: materi,
            })
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

  static async updateMateri(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      if (data.id) delete data.id;
      const materi = await MateriModel.findByPk(id);

      if (materi === null) {
        return res.status(404).json({
          status: false,
          message: "Materi tidak ditemukan",
          data: null,
        });
      }

      let fileName = "";
      if (req.files === null || !req.files.file) {
        fileName = materi.videoFile ? materi.videoFile.split("/").pop() : "";
      } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = getUrl(req)
        const videoFile = `${url}/public/videoFile/${fileName}`;
        const allowedType = ['.mp4', '.mkv', '.avi', '.mov', '.webm']

        if (!allowedType.includes(ext.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid file" });
        }
         if (fileSize > 100 * 1024 * 1024) return res.status(422).json({ msg: "Video must be less than 100 MB" })
        if (materi.videoFile) {
        const oldFile = `./public/videoFile/${materi.videoFile.split("/").pop()}`;
        if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
        }

        await file.mv(`./public/videoFile/${fileName}`);

        if (fileName) {
        data.videoFile = videoFile;
        }
      }
      await materi.update(data);
      return res.status(200).json({
        status: true,
        message: "Berhasil memperbarui materi materi",
        data: materi,
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

  static async removeMateri(req, res) {
    try {
      const { id } = req.params;

      const materi = await MateriModel.findByPk(id);
      if (!materi) {
        return res.status(404).json({
          status: false,
          message: "materi materi tidak ditemukan",
          data: null,
        });
      }
      if (materi.gambar) {
        const oldFile = `./public/gambar/${materi.gambar.split("/").pop()}`;
        if (fs.existsSync(oldFile)) {
          fs.unlinkSync(oldFile);
        }
      }
      await materi.destroy();
      return res.status(200).json({
        status: true,
        message: "Berhasil menghapus materi materi",
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

  static async materiAndJenis(req, res) {
    try {
      const jenis = await JenisMateriModel.findAll()
      let materi = await MateriModel.findAll({
        include: ["jenis_materi"]
      })
      materi = materi.map((item) => {
        item = item.get()
        const jenis = item.jenis_materi
        delete item.jenis_materi
        return { ...item, jenis }
      })
      return res.status(200).json({
        status: true,
        message: "Berhasil mengambil data materi dan jenis materi",
        data: { jenis, materi },
      });
    } catch (error) {
      log.error(error.message);
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan, silakan coba lagi",
        data: null,
      });
    }
  }
}

module.exports = MateriController
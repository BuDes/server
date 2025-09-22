const log = require("../../utils/log")
const getUrl = require("../../utils/get_url")
const JenisMateri = require("./jenis_materi_model")
const fs = require('fs')
const path = require('path')
const { Op } = require("sequelize");

class JenisMateriController {
  static async allJenisMateri(req, res) {
    try {
      const jenis = await JenisMateri.findAll()
      return res.status(200).json({
        status: true,
        message: "Berhasil mengambil data Produk",
        data: jenis,
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

  static async addJenis(req, res) {
    try {
      const data = req.body
      const existingJenis = await JenisMateri.findOne({ where: { nama: data.nama } });
      if (existingJenis) {
      return res.status(400).json({
        status: false,
        message: "Jenis materi sudah ada",
        data: null,
        });
      }
      if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" })
      const file = req.files.file
      const fileSize = file.data.length
      const ext = path.extname(file.name)
      const fileName = file.md5 + ext
      const url = getUrl(req)
      const gambar = `${url}/public/gambar/${fileName}`
      const allowedType = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
      if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Image" })
      if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" })
      file.mv(`./public/gambar/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message })
        try {
            const jenisData = {
                ...data,
                gambar: gambar
            }
            const jenis = await JenisMateri.create(jenisData)
            return res.status(201).json({
                status: true,
                message: "Berhasil menambahkan jenis materi",
                data: jenis,
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

  static async updateJenis(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      if (data.id) delete data.id;
      const jenis = await JenisMateri.findByPk(id);

      if (jenis === null) {
        return res.status(404).json({
          status: false,
          message: "Jenis materi tidak ditemukan",
          data: null,
        });
      }

      if (data.nama) {
      const existingProduk = await JenisMateri.findOne({
        where: { nama: data.nama, id: { [Op.ne]: id } }
      });
      if (existingProduk) {
        return res.status(400).json({
          status: false,
          message: "Jenis materi sudah ada",
          data: null,
        });
      }
    }

      let fileName = "";
      if (req.files === null || !req.files.file) {
        fileName = jenis.gambar ? jenis.gambar.split("/").pop() : "";
      } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = getUrl(req)
        const gambar = `${url}/public/gambar/${fileName}`;
        const allowedType = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

        if (!allowedType.includes(ext.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid Image" });
        }
        if (fileSize > 5000000) {
          return res.status(422).json({ msg: "Image must be less than 5 MB" });
        }

        if (jenis.gambar) {
        const oldFile = `./public/gambar/${jenis.gambar.split("/").pop()}`;
        if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
        }

        await file.mv(`./public/gambar/${fileName}`);

        if (fileName) {
        data.gambar = gambar;
        }
      }
      await jenis.update(data);
      return res.status(200).json({
        status: true,
        message: "Berhasil memperbarui jenis materi",
        data: jenis,
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

  static async removeJenis(req, res) {
    try {
      const { id } = req.params;

      const jenis = await JenisMateri.findByPk(id);
      if (!jenis) {
        return res.status(404).json({
          status: false,
          message: "Jenis materi tidak ditemukan",
          data: null,
        });
      }
      if (jenis.gambar) {
        const oldFile = `./public/gambar/${jenis.gambar.split("/").pop()}`;
        if (fs.existsSync(oldFile)) {
          fs.unlinkSync(oldFile);
        }
      }
      await jenis.destroy();
      return res.status(200).json({
        status: true,
        message: "Berhasil menghapus jenis materi",
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

}

module.exports = JenisMateriController
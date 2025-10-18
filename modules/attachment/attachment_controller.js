const log = require("../../utils/log")
const AttachmentModel = require("./attachment_model")
const path = require("path")

class AttachmentController {
  static async allAttachment(req, res) {
    try {
      const attachment = await AttachmentModel.findAll()
      return res.status(200).json({
        status: true,
        message: "Berhasil mengambil data attachment",
        data: attachment,
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

  static async singleAttachment(req, res) {
    try {
      const { id } = req.params
      const attachment = await AttachmentModel.findByPk(id)
      return res.status(200).json({
        status: true,
        message: "Berhasil mengambil data attachment",
        data: attachment,
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

  static async addAttachment(req, res) {
    try {
      const data = req.body ?? {}

      const uploadedFile = req.files?.audioFile;
      if (uploadedFile) {
        const audioFile = `${Date.now()}-${uploadedFile.name}`
        const uploadPath = path.join("public", 'audioFile', audioFile);

        await uploadedFile.mv(uploadPath)
        data.audioFile = audioFile
      }

      const attachment = await AttachmentModel.create(data)
      return res.status(201).json({
        status: true,
        message: "Berhasil menambahkan attachment",
        data: attachment,
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

  static async editAttachment(req, res) {
    try {
      const data = req.body
      const { id } = req.params
      console.log(id)
      await AttachmentModel.update(data, {
        where: { id }
      })
      const attachment = await AttachmentModel.findByPk(id)
      return res.status(200).json({
        status: true,
        message: "Berhasil edit attachment",
        data: attachment,
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

  static async removeAttachment(req, res) {
    try {
      const { id } = req.params
      await AttachmentModel.destroy({
        where: { id }
      })
      return res.status(200).json({
        status: true,
        message: "Berhasil menghapus attachment",
        data: null,
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

}

module.exports = AttachmentController
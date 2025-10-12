const log = require("../../utils/log")
const MessageModel = require("./message_model")

class MessageController {
  static async incomingMessages(req, res) {
    try {
      const { idUser } = req
      
      // get received messages
      const messages = await MessageModel.findAll({
        where: { toUserId: idUser }
      })
      
      // delete received messages from server db
      const messageIds = messages.map((e) => e.id)
      await MessageModel.destroy({ where: { id: messageIds } })
      return res.status(200).json({
        status: true,
        message: "Berhasil mengambil pesan masuk",
        data: messages,
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

module.exports = MessageController
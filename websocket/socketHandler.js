const MessageModel = require("../modules/message/message_model");
const UserModel = require("../modules/user/user_model");

const users = {}; // userId -> socket.id

module.exports = (io) => {
  io.on("connection", (socket) => {
    const { userId } = socket.handshake.query;
    console.log("Client connected:", socket.id);
    console.log("User id:", userId)

    UserModel.findByPk(userId).then((user) => {
      if (!user) return;
  
      socket.userId = user.id;
      users[user.id] = { socketId: socket.id, nama: user.nama, user_id : user.id };
    });

    socket.on("connect_users", async (data) => {
      io.emit(
        "get_online_users",
        Object.entries(users).map(([id, u]) => ({
          id: parseInt(id),
          nama: u.nama,
        }))
      );
    });

    socket.on("send_message", async ({ to_user_id, content }, callback) => {
      const { userId } = socket.handshake.query;
      if (!userId) return;

      console.log(content, socket.userId, to_user_id);
     
      const message = await MessageModel.create({
        content,
        fromUserId: socket.userId,
        toUserId: to_user_id,
      })
      // const message = await prisma.message.create({
      //   data: {
      //     content,
      //     fromUserId: socket.userId,
      //     toUserId: Number(to_user_id),
      //   },
      // });

      // Kirim ke penerima
      const toSocketId = users[`${to_user_id}`]?.socketId;
      console.log("tes luar :", toSocketId, users)
      
      if (toSocketId) {
        console.log("tes dalem")
        io.to(toSocketId).emit("receive_message", message);
        // TODO: delete message
        await MessageModel.destroy({ where: { id: message.id } })
        // await prisma.message.delete({ where: { id: message.id } })
      }
      callback({ status: true, id: message.id })
    });

    socket.on("disconnect", () => {
      delete users[socket.userId];
      io.emit(
        "get_online_users",
        Object.keys(users).map((id) => parseInt(id))
      );
    });
  });
};

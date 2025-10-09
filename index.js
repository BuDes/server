require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const routes = require("./routes");
const logger = require("./utils/logger");
const log = require("./utils/log");
const getUrl = require("./utils/get_url");
const { defineAssociations } = require('./modules/associations');
const FileUpload = require("express-fileupload");
const http = require('http');
const { Server } = require('socket.io');
const socketHandler = require('./websocket/socketHandler');

const app = express();
const PORT = process.env.PORT || 3000;
const apiVersion = process.env.API_VERSION || '/api';
defineAssociations()

app.use(logger)
app.use(cors());
app.use(express.json());
app.use(FileUpload());
app.use("/public", express.static("public"));
app.use(apiVersion, routes);

app.get('/', (req, res) => {
  const url = getUrl(req)
  res.status(200).json({ message: 'Selamat datang', url });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

socketHandler(io);

db.sync({ alter: true })
  .then(() => {
    server.listen(PORT, () => {
      log.debug(`\nServer berjalan di http://localhost:${PORT}\n`);
    });
  })
  .catch((err) => {
    log.error("Gagal menghubungkan ke database:", err);
  });
const express = require("express");
const authentication = require("../../middlewares/authentication");
const MessageController = require("./message_controller");
const router = express.Router();

router.get("/", authentication, MessageController.incomingMessages)

module.exports = router;

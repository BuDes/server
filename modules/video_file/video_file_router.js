const express = require("express");
const VideoFileController = require("./video_file_controller");
const router = express.Router();

router.get("/:filename", VideoFileController.getVideo)

module.exports = router;
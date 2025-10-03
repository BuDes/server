const express = require("express");
const authentication = require("../../middlewares/authentication");
const NilaiController = require("./nilai_controller");
const router = express.Router();

router.get("/:tipe", authentication, NilaiController.getNilaiByType)

module.exports = router;
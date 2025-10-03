const express = require("express");
const RiwayatController = require("./riwayat_controller");
const authentication = require("../../middlewares/authentication");
const router = express.Router();

// TODO: auth admin
router.get("/", authentication, RiwayatController.myRiwayat)
router.post("/add", RiwayatController.addRiwayat)
router.put("/edit/:id", RiwayatController.updateriwayat)
router.delete("/remove/:id", RiwayatController.removeriwayat)

module.exports = router;
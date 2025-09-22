const express = require("express");
const RiwayatController = require("./riwayat_controller");
const router = express.Router();

// TODO: auth admin
router.get("/", RiwayatController.allRiwayat)
router.post("/add", RiwayatController.addRiwayat)
router.put("/edit/:id", RiwayatController.updateriwayat)
router.delete("/remove/:id", RiwayatController.removeriwayat)

module.exports = router;
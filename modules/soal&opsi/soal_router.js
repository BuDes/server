const express = require("express");
const SoalController = require("./soal_controller");
const router = express.Router();

// TODO: auth admin
router.get("/", SoalController.allSoal)
router.get("/tipe/:tipe", SoalController.allSoalTipe)
router.get("/:id", SoalController.soalByidJadwal)
router.post("/add", SoalController.addSoal)
router.post("/add_many", SoalController.addManySoal)
router.put("/edit/:id", SoalController.updateSoal)
router.delete("/remove/:id", SoalController.removeSoal)

module.exports = router;
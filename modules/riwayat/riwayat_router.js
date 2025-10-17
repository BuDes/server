const express = require("express");
const RiwayatController = require("./riwayat_controller");
const authentication = require("../../middlewares/authentication");
const router = express.Router();

// TODO: auth admin
router.get("/", authentication, RiwayatController.myRiwayat)
router.get("/hasil_practice_test", authentication, RiwayatController.hasilPracticeTest)
router.get("/jadwal_test/:idJadwal", authentication, RiwayatController.hasilTest)
router.post("/submit_jawaban", authentication, RiwayatController.submitAnswers)
router.post("/add", authentication, RiwayatController.addRiwayat)
router.put("/edit/:id", RiwayatController.updateriwayat)
router.delete("/remove/:id", RiwayatController.removeriwayat)

module.exports = router;
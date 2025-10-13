const express = require("express");
const JadwalTestController = require("./jadwal_test_controller");
const authentication = require("../../middlewares/authentication");
const router = express.Router();

router.get("/", authentication, JadwalTestController.jadwalByUser)
// router.get("/unregistered", authentication, JadwalTestController.upcomingJadwalByUser)
// TODO: auth admin
router.get("/all", JadwalTestController.allJadwalTest)
router.get("/all_sorted", JadwalTestController.sortedJadwal)
router.get("/details/:id", JadwalTestController.detailJadwal)
router.post("/add", JadwalTestController.addJadwalTest)
router.post("/daftar/:idJadwal", authentication, JadwalTestController.daftarTest)
router.put("/edit/:id", JadwalTestController.updateJadwalTest)
router.delete("/remove/:id", JadwalTestController.removeJadwalTest)

module.exports = router;
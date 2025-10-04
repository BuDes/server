const express = require("express");
const JenisMateriController = require("./jenis_materi_controller");
const router = express.Router();

// TODO: auth admin
router.get("/", JenisMateriController.allJenisMateri)
router.get("/single/:id", JenisMateriController.singleJenis)
router.post("/add", JenisMateriController.addJenis)
router.put("/edit/:id", JenisMateriController.updateJenis)
router.delete("/remove/:id", JenisMateriController.removeJenis)

module.exports = router;
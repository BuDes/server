const express = require("express");
const OpsiController = require("./opsi_controller");
const router = express.Router();

// TODO: auth admin
router.get("/", OpsiController.allOpsi)
router.post("/add", OpsiController.addOpsi)
router.put("/edit/:id", OpsiController.updateOpsi)
router.delete("/remove/:id", OpsiController.removeOpsi)

module.exports = router;
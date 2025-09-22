const express = require("express");
const MateriController = require("./materi_controller");
const router = express.Router();

router.get("/", MateriController.allMateri)
router.post("/add", MateriController.addMateri)
router.get("/:id", MateriController.materiByIdJenis)
router.put("/edit/:id", MateriController.updateMateri)
router.delete("/remove/:id", MateriController.removeMateri)

module.exports = router;
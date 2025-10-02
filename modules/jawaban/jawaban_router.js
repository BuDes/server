const express = require("express");
const authentication = require("../../middlewares/authentication");
const JawabanController = require("./jawaban_controller");
const router = express.Router();

router.get("/", authentication, JawabanController.allJawabanByUser)
router.post("/add", authentication, JawabanController.addJawaban)
router.put("/edit/:id", authentication, JawabanController.updateJawaban)
router.delete("/remove/:id", authentication, JawabanController.removeJawaban)

module.exports = router;
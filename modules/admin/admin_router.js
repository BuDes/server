const express = require("express");
const AdminController = require("./admin_controller");
const router = express.Router();

router.get("/", AdminController.getAdmin)
router.get("/dashboard", AdminController.dashboard)
router.post("/register", AdminController.register)
router.post("/login", AdminController.login)

module.exports = router;

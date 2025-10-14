const express = require("express");
const UserController = require("./user_controller");
const authentication = require("../../middlewares/authentication");
const router = express.Router();

router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.get("/profile", authentication, UserController.profile)
router.get("/pakar", UserController.getAllPakar)
router.put("/profile", authentication, UserController.updateProfile)
router.delete("/logout", authentication, UserController.logout)
router.put("/update_password", authentication, UserController.updatePassword)

router.get("/", UserController.allUser)
router.delete("/remove/:id", UserController.removeUser)


module.exports = router;
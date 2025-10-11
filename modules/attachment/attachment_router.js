const express = require("express");
const AttachmentController = require("./attachment_controller");
const router = express.Router();

router.get("/", AttachmentController.allAttachment)
router.post("/add", AttachmentController.addAttachment)
router.put("/edit/:id", AttachmentController.editAttachment)
router.delete("/remove/:id", AttachmentController.removeAttachment)

module.exports = router;

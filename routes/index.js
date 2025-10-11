const express = require("express");
const router = express.Router();

const adminRouter = require("../modules/admin/admin_router")
const userRouter = require("../modules/user/user_router")
const materiRouter = require("../modules/materi/materi_ router")
const jenisMateriRouter = require("../modules/jenis_materi/jenis_materi_router")
const jadwalTestRouter = require("../modules/jadwal_test/jadwal_test_router")
const riwayatRouter = require("../modules/riwayat/riwayat_router")
const soalRouter = require("../modules/soal&opsi/soal_router")
const jawabanRouter = require("../modules/jawaban/jawaban_router")
const nilaiRouter = require("../modules/nilai/nilai_router")
const attachmentRouter = require("../modules/attachment/attachment_router")

router.use("/admin", adminRouter)
router.use("/user", userRouter)
router.use("/materi", materiRouter)
router.use("/jenis_materi", jenisMateriRouter)
router.use("/jadwal_test", jadwalTestRouter)
router.use("/riwayat", riwayatRouter)
router.use("/soal", soalRouter)
router.use("/jawaban", jawabanRouter)
router.use("/nilai", nilaiRouter)
router.use("/attachment", attachmentRouter)

module.exports = router;

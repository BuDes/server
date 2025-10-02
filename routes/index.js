const express = require("express");
const router = express.Router();

const adminRouter = require("../modules/admin/admin_router")
const userRouter = require("../modules/user/user_router")
const materiRouter = require("../modules/materi/materi_ router")
const jenisMateriRouter = require("../modules/jenis_materi/jenis_materi_router")
const jadwalTestRouter = require("../modules/jadwal_test/jadwal_test_router")
const riwayatRouter = require("../modules/riwayat/riwayat_router")
const soalRouter = require("../modules/soal/soal_router")
// const dashboardRouter = require("../modules/dashboard/dashboard_router")


// const mutasiRouter = require("../modules/mutasi/mutasi_router")
// const driverRouter = require("../modules/driver/driver_router")

router.use("/admin", adminRouter)
router.use("/user", userRouter)
router.use("/materi", materiRouter)
router.use("/jenis_materi", jenisMateriRouter)
router.use("/jadwal_test", jadwalTestRouter)
router.use("/riwayat", riwayatRouter)
router.use("/soal", soalRouter)
// router.use("/dashboard", dashboardRouter)

// router.use("/mutasi", mutasiRouter)
// router.use("/driver", driverRouter)


module.exports = router;

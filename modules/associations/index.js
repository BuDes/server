const UserModel = require('../user/user_model')
const MateriModel = require("../materi/materi_model")
const JenisMateriModel = require("../jenis_materi/jenis_materi_model")
const RiwayatModel = require('../riwayat/riwayat_model')
const JadwalTestModel = require('../jadwal_test/jadwal_test_model')
const SoalModel = require('../soal/soal_model')
const OpsiModel = require('../opsi/opsi_model')

function defineAssociations() {
  MateriModel.belongsTo(JenisMateriModel, { 
    as: "jenis_materi", 
    foreignKey: "idJenisMateri", 
    onDelete: "RESTRICT" 
  })
  JenisMateriModel.hasMany(MateriModel, { 
    as: "materi", 
    foreignKey: "idJenisMateri", 
    onDelete: "RESTRICT" 
  })

  RiwayatModel.belongsTo(UserModel, { 
    foreignKey: "idUser",
    as: "user"
  })
  UserModel.hasMany(RiwayatModel, {
    foreignKey: "idUser",
    as: "riwayat"
  })

  RiwayatModel.belongsTo(JadwalTestModel, {
    foreignKey: "idJadwalTest",
    as: "jadwal_test"
  })
  JadwalTestModel.hasMany(RiwayatModel,{
    foreignKey: "idJadwalTest",
    as: "riwayat"
  })
  
  SoalModel.belongsTo(JadwalTestModel, {
    foreignKey: "idJadwalTest",
    as: "jadwal_test"
  })
  JadwalTestModel.hasMany(SoalModel, {
    foreignKey: "idJadwalTest",
    as: "jadwal_test"
  })

  SoalModel.belongsTo(JenisMateriModel, {
    foreignKey: "idJenisMateri",
    as: "jenis_materi"
  })
  JenisMateriModel.hasMany(SoalModel, {
    foreignKey: "idJenisMateri",
    as: "jenis_materi"
  })

  SoalModel.hasMany(OpsiModel, {
  foreignKey: "idSoal",
  as: "opsi",
  onDelete: "CASCADE"
  })
  OpsiModel.belongsTo(SoalModel, {
  foreignKey: "idSoal",
  as: "soal",
  onDelete: "CASCADE"
  })
  SoalModel.belongsTo(OpsiModel, {
  foreignKey: "idOpsiBenar",
  as: "jawaban_benar",
  })
}

module.exports = { defineAssociations }
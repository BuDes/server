const UserModel = require('../user/user_model')
const MateriModel = require("../materi/materi_model")
const JenisMateriModel = require("../jenis_materi/jenis_materi_model")
const RiwayatModel = require('../riwayat/riwayat_model')
const JadwalTestModel = require('../jadwal_test/jadwal_test_model')
const PesertaModel = require('../peserta/peserta_model')

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
  PesertaModel.belongsTo(UserModel, {
    foreignKey: "idUser",
    as: "user"
  })
  UserModel.hasMany(PesertaModel, {
    foreignKey: "idUser",
    as: "peserta",
  })
  PesertaModel.belongsTo(JadwalTestModel, {
    foreignKey: "idJadwalTest",
    as: "jadwal_test"
  })
  JadwalTestModel.hasMany(PesertaModel, {
    foreignKey: "idJadwalTest",
    as: "peserta"
  })
  
}

module.exports = { defineAssociations }
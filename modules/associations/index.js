const UserModel = require('../user/user_model')
const MateriModel = require("../materi/materi_model")
const JenisMateriModel = require("../jenis_materi/jenis_materi_model")
const RiwayatModel = require('../riwayat/riwayat_model')
const JadwalTestModel = require('../jadwal_test/jadwal_test_model')
const PesertaModel = require('../peserta/peserta_model')
const SoalModel = require('../soal&opsi/soal_model')
const OpsiModel = require('../soal&opsi/opsi_model')
const JawabanModel = require('../jawaban/jawaban_model')
const AttachmentModel = require('../attachment/attachment_model')
const MessageModel = require('../message/message_model')

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
  RiwayatModel.belongsTo(MateriModel, {
    foreignKey: "idMateri",
    as: "materi"
  })
  MateriModel.hasMany(RiwayatModel,{
    foreignKey: "idMateri",
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

  SoalModel.belongsTo(JenisMateriModel, {
    foreignKey: "idJenisMateri",
    as: "jenis_materi"
  })
  JenisMateriModel.hasMany(SoalModel, {
    foreignKey: "idJenisMateri",
    as: "soal"
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

  JawabanModel.belongsTo(OpsiModel, {
    foreignKey: "idOpsi",
    as: "opsi"
  })

  JawabanModel.belongsTo(RiwayatModel, {
    foreignKey: "idRiwayat",
    as: "riwayat"
  })
  RiwayatModel.hasMany(JawabanModel, {
    foreignKey: "idRiwayat",
    as: "jawaban"
  })
  
  SoalModel.belongsTo(AttachmentModel, {
    foreignKey: "idAttachment",
    as: "attachment"
  })
  AttachmentModel.hasMany(SoalModel, {
    foreignKey: "idAttachment",
    as: "soal"
  })
  
  MessageModel.belongsTo(UserModel, {
    foreignKey: "fromUserId",
    as: "fromUser"
  })
  UserModel.hasMany(MessageModel, {
    foreignKey: "fromUserId",
    as: "sentMessages"
  })
  MessageModel.belongsTo(UserModel, {
    foreignKey: "toUserId",
    as: "toUser"
  })
  UserModel.hasMany(MessageModel, {
    foreignKey: "toUserId",
    as: "receivedMessages"
  })

}

module.exports = { defineAssociations }
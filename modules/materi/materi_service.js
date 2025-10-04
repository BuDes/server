class MateriService {
  static parseJenisImage(listJenis, url) {
    return listJenis.map((jenis) => {
      const gambar = `${url}/public/gambar/${jenis.gambar}`
      return { ...jenis, gambar }
    })
  }

  static parseMateri(listMateri, url) {
    return listMateri.map((materi) => {
      const jenis = materi.jenis_materi
      delete materi.jenis_materi
      return { ...materi, jenis }
    })
  }
}

module.exports = MateriService
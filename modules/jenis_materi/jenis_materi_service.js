class JenisMateriService {
  static parseImage(listJenis, url) {
    return listJenis.map((jenis) => {
      const gambar = `${url}/public/gambar/${jenis.gambar}`
      return { ...jenis, gambar }
    })
  }
}

module.exports = JenisMateriService
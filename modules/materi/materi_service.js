class MateriService {
  static parseJenisImage(listJenis, url) {
    return listJenis.map((jenis) => {
      const gambar = `${url}/public/gambar/${jenis.gambar}`
      return { ...jenis, gambar }
    })
  }

  static parseMateriVideo(listMateri, url) {
    return listMateri.map((materi) => {
      const videoFile = materi.videoFile
          ? `${url}/public/videoFile/${materi.videoFile}`
          : null
      return { ...materi, videoFile }
    })
  }

  static parseJenisMateri(listMateri) {
    return listMateri.map((materi) => {
      const jenis = materi.jenis_materi
      delete materi.jenis_materi
      return { ...materi, jenis }
    })
  }
}

module.exports = MateriService
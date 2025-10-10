const fs = require("fs")
const path = require("path")
const mime = require("mime")

class VideoFileController {
  static getVideo(req, res) {
    // const videoPath = path.join("public/videoFile", req.params.filename);
    // const videoSize = fs.statSync(videoPath).size;
    // const headers = {
    //   "Content-Length": videoSize,
    //   "Content-Type": "video/mp4",
    // };

    // res.writeHead(200, headers);
    // fs.createReadStream(videoPath).pipe(res);

    const videoPath = path.join("public/videoFile", req.params.filename);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).send("Video not found");
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    const contentType = mime.default.getType(videoPath) || "video/mp4";

    if (range) {
      // Parse Range header (example: "bytes=0-")
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunkSize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": contentType,
      });

      file.pipe(res);
    } else {
      // Send entire file if no range request
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": contentType,
      });
      fs.createReadStream(videoPath).pipe(res);
    }
  }
}

module.exports = VideoFileController
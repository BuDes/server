function getUrl(req) {
  const host = req.get('host')
  const protocol = req.protocol
  const url = `${protocol}://${host}`
  return url
}

module.exports = getUrl
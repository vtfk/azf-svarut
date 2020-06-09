module.exports = (req) => {
  return req.headers['x-functions-key'] || req.query.code
}

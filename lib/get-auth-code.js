module.exports = (req) => {
  return req.query.statusCode || req.query.code || req.headers['x-functions-key']
}

module.exports = {
  SVARUT: {
    username: process.env.SVARUT_USERNAME,
    password: process.env.SVARUT_PASSWORD,
    url: process.env.SVARUT_URL
  },
  RETRY: {
    ATTEMPTS: parseInt(process.env.RETRY_ATTEMPTS) || 5,
    WAIT: parseInt(process.env.RETRY_WAIT) || 10000
  },
  STATUS_ENDPOINT: process.env.STATUS_ENDPOINT || 'api/status'
}

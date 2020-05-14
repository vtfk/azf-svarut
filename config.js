module.exports = {
  SVARUT: {
    username: process.env.SVARUT_USERNAME,
    password: process.env.SVARUT_PASSWORD,
    url: process.env.SVARUT_URL
  },
  RETRY: {
    ATTEMPTS: process.env.RETRY_ATTEMPTS || 5,
    WAIT: process.env.RETRY_WAIT || 10000
  }
}

const config = require('../config')
const svarut = require('@vtfk/svarut')(config.SVARUT)

module.exports = async function (context) {
  const { letter } = context.bindings
  context.log('Starting activity!')

  try {
    if (Array.isArray(letter.mottaker)) {
      return await Promise.all(letter.mottaker.map(async mottaker => {
        try {
          return await svarut.sendForsendelse({ ...letter, mottaker })
        }
        catch (error) {
          throw error
        }
      }))
    }
  }
  catch (error) {
    if (error.config && error.config.auth) delete error.config.auth
    throw error
  }
}

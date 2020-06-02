const config = require('../config')
const svarut = require('@vtfk/svarut')(config.SVARUT)

module.exports = async function (context) {
  const { letter } = context.bindings
  context.log("Starting activity!")

  try {
    if (Array.isArray(letter.mottaker)) {
      return letter.mottaker.map(async mottaker => {
        try {
          return await svarut.sendForsendelse({ ...letter, mottaker })
        }
        catch (error) {
          context.error(JSON.stringify(error, null, 2))
          return error
        }
      })
    }

    return await svarut.sendForsendelse(letter)
  }
  catch (error) {
    context.log(JSON.stringify(error, null, 2))
    if (error.config && error.config.auth) delete error.config.auth
    return error
  }
}

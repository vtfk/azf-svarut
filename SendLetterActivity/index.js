const config = require('../config')
const svarut = require('@vtfk/svarut')(config.SVARUT)

module.exports = async function (context) {
  const { letter } = context.bindings
  context.log('Running activity!', letter)

  try {
    const response = await svarut.sendForsendelse(letter)
    return response
  } catch (error) {
    context.log(JSON.stringify(error, null, 2))
    delete error.config.auth
    return error
  }
}

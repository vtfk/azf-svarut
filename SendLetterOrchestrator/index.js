const df = require('durable-functions')
const checkResponse = require('../lib/checkResponse')
// const { RETRY } = require('../config')

module.exports = df.orchestrator(function * (context) {
  const letter = context.df.getInput()
  context.log('Orchestrator triggered!')

  // const retryOptions = new df.RetryOptions(RETRY.WAIT, RETRY.ATTEMPTS)
  // const response = yield context.df.callActivityWithRetry('SendLetterActivity', retryOptions, letter)
  const response = yield context.df.callActivity('SendLetterActivity', letter)
  context.log('Got response:', response)
  // context.df.setCustomStatus(response.errorcode !== undefined || response.stack ? 'Failed' : 'Sent')
  const responseStatus = checkResponse(response, context)
  context.df.setCustomStatus(responseStatus)

  return response
})

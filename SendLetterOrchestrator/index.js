const df = require('durable-functions')
const { RETRY } = require('../config')

module.exports = df.orchestrator(function * (context) {
  const letter = context.df.getInput()
  context.log('Orchestrator triggered!', letter)

  const retryOptions = new df.RetryOptions(RETRY.WAIT, RETRY.ATTEMPTS)
  const response = yield context.df.callActivityWithRetry('SendLetterActivity', retryOptions, letter)
  return response
})

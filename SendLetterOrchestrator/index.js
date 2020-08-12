const df = require('durable-functions')
const checkResponse = require('../lib/checkResponse')

module.exports = df.orchestrator(function * (context) {
  const letter = context.df.getInput()
  context.log('Orchestrator triggered!')

  const response = yield context.df.callActivity('SendLetterActivity', letter)
  const responseStatus = checkResponse(response, context)
  context.df.setCustomStatus(responseStatus)

  return response
})

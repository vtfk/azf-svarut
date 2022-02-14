const df = require('durable-functions')
const checkResponse = require('../lib/checkResponse')

module.exports = df.orchestrator(function * (context) {
  const { body: letter, headers, params } = context.df.getInput()
  context.log('Orchestrator triggered!')

  const response = yield context.df.callActivity('SendLetterActivity', letter)
  const responseStatus = checkResponse(response, context)

  yield context.df.callActivity('E18Activity', { body: letter, headers, params, status: responseStatus === 'Sent' ? 'completed' : 'failed', response })

  context.df.setCustomStatus(responseStatus)

  return response
})

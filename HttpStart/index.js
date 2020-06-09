const df = require('durable-functions')
const getStatusResponse = require('../lib/get-status-response')

module.exports = async function (context, req) {
  const client = df.getClient(context)
  const instanceId = await client.startNew(`${req.params.functionName}Orchestrator`, undefined, req.body)

  context.log(`Started orchestration with ID = '${instanceId}'.`)

  return getStatusResponse(req, client, instanceId)
}

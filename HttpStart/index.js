const df = require('durable-functions')
const getStatusResponse = require('../lib/get-status-response')

module.exports = async function (context, req) {
  const client = df.getClient(context)
  // we have to generate the input like this to pass all the info we need
  const instanceId = await client.startNew(`${req.params.functionName}Orchestrator`, undefined, { body: req.body, headers: req.headers, params: req.params })

  context.log(`Started orchestration with ID = '${instanceId}'.`)

  context.res = getStatusResponse(req, client, instanceId, 3)
  context.res.headers['Content-Type'] = 'application/json; charset=utf-8'
}

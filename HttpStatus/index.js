const df = require('durable-functions')
const getStatusResponse = require('../lib/get-status-response')

module.exports = async function (context, req) {
  const client = df.getClient(context)
  const { instanceId } = req.params
  const status = await client.getStatus(instanceId, true)

  // Remove input from status object if everything is fine (Completed and Sent)
  if (status.input && status.runtimeStatus === 'Completed' && status.customStatus === 'Sent') {
    delete status.input
  }

  context.res = status ? { body: status } : getStatusResponse(client, instanceId)
}

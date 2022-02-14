const { create: roadRunner } = require('@vtfk/e18')

module.exports = async function (context) {
  const { body, headers, params, status, response } = context.bindings.req
  const data = status === 'completed' ? response : undefined
  const error = status === 'failed' ? response : undefined

  // context has to be generated like this to get the correct functionName
  // because we are using the shortcut "{functionName}" in the HttpStart route to
  // get the functionName from the Orchestator....
  return await roadRunner({ body, headers }, { status, data, error }, { executionContext: { ...params } })
}

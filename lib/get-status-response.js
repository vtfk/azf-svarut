const config = require('../config')
const getAuthCode = require('./get-auth-code')

module.exports = (req, client, instanceId, retryAfter = 10) => {
  const managementUrls = client.createHttpManagementPayload(instanceId)
  const oldStatus = managementUrls.statusQueryGetUri

  const hostname = oldStatus.match(/(^(?:(?:.*?)?\/\/)?[^/?#;]*)/)[0]
  const code = getAuthCode(req)
  const codeParam = code ? `?code=${code}` : ''

  const statusUrl = `${hostname}/${config.STATUS_ENDPOINT}/${instanceId}${codeParam}`
  managementUrls.statusQueryGetUri = statusUrl

  return {
    status: 202,
    headers: {
      Location: statusUrl,
      'Retry-After': retryAfter
    },
    body: managementUrls
  }
}

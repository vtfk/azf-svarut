const config = require('../config')

module.exports = (client, instanceId, retryAfter = 10) => {
  const managementUrls = client.createHttpManagementPayload(instanceId)
  const oldStatus = managementUrls.statusQueryGetUri

  const hostname = oldStatus.match(/(^(?:(?:.*?)?\/\/)?[^/?#;]*)/)[0]
  const queryParams = oldStatus.match(/(\?)([^=]+)=([^]+)/g)[0]

  const statusUrl = `${hostname}/${config.STATUS_ENDPOINT}/${instanceId}${queryParams}`
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

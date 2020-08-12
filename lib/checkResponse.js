const errorcodes = require('./feilkoder.json')

const checkResponse = (response, context) => {
  // sjekk om response er godkjent
  if (response.id) {
    return true
  } else if (response.stack) {
    context.log('Stack given (false):', response.stack)
    return false
  } else if (!response.errorcode) {
    return false
  } else {
    const allowed = errorcodes.godkjente.indexOf(response.errorcode) > -1
    context.log('Is errorcode allowed:', allowed)
    return allowed
  }
}

module.exports = (response, context) => {
  if (!response) {
    return 'Failed'
  } else {
    // sjekk om response er et array
    if (Array.isArray(response)) {
      // sjekk om alle responser er godkjente
      const allValid = response.every((res) => {
        return checkResponse(res, context)
      })
      return allValid ? 'Sent' : 'Failed'
    } else {
      // sjekk om responsen er godkjent
      const valid = checkResponse(response, context)
      return valid ? 'Sent' : 'Failed'
    }
  }
}

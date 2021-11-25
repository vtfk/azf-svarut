const errorCodes = require('./feilkoder.json')
const errorMessages = require('./preapproved-messages.json')

const checkResponse = (response, context) => {
  // sjekk om response er godkjent
  if (response.id) {
    context.log('checkResponse - successfull')
    return true
  } else if (response.stack) {
    context.log('checkResponse - stack found:', response.stack)
    return false
  } else {
    const allowedErrorCode = response.errorcode ? (errorCodes.godkjente.indexOf(response.errorcode) > -1) : response.errorCode ? (errorCodes.godkjente.indexOf(response.errorCode) > -1) : false
    const allowedMessage = response.message ? errorMessages.godkjente.some(message => response.message.includes(message)) : false
    context.log('checkResponse -', response.message, '- preapproved ?', allowedErrorCode || allowedMessage)
    return allowedErrorCode || allowedMessage
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

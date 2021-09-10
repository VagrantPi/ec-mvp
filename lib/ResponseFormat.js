const Codes = require('./Codes')

class ResponseFormat {
  constructor({ codesKey = '', message, data = {} } = {}) {
    const code = Codes[codesKey] || Codes.ServerError
    message = message || codesKey

    return {
      success: Codes[codesKey] === Codes.Success,
      code,
      message,
      data
    }
  }

}

module.exports = ResponseFormat;

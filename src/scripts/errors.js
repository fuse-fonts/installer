"use strict";

const errorMessages = require("./data/error-codes.json");

class ErrorCodes {
  
  static get(code) {
    let message = null;

    search:
    for (let i = 0, ii = errorMessages.length; i < ii; i++) {

      const error = errorMessages[i];

      if (error.codes.indexOf(code) > -1) {
        message = error.message;
        break search;
      }
    }

    return message;
  }
}

global.ErrorCodes = ErrorCodes;
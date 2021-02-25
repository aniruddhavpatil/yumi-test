class GeneralError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }

  getCode() {
    if (this instanceof BadRequest) {
      return 422;
    } if (this instanceof NotFound) {
      return 422;
    }
    return 500;
  }
}

class BadRequest extends GeneralError { }
class NotFound extends GeneralError { }

module.exports = {
  GeneralError,
  BadRequest,
  NotFound
};
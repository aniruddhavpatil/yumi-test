const { GeneralError } = require('../utils/errors');

const handleErrors = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({errors: [err.message]});
  }

  return res.status(500).send(err.message);
}


module.exports = handleErrors;
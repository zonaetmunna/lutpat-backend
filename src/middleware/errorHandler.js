// const _log = require("../utils/logger");
const logger = require('../utils/logger');
const responseGenerate = require('../utils/responseGenerate');

const errorHandler = (err, req, res, next) => {
  if (err) {
    let statusCode = 500;
    if (err.name == 'validationError') {
      statusCode = 400;
    }
    const errorPaths = Object.keys(err.errors || {});
    const errorMessages = errorPaths.map((path) => err.errors[path].properties.message);
    const errorMessage = errorMessages.join(', ') || err.message;

    logger(`Error: ${req.method} request from ${req.ip} on route ${req.path}`, 'red');
    
    res
      .status(statusCode)
      .json(responseGenerate(
        null,
        errorMessage,
        true)
      );
  };
  
};

module.exports = errorHandler;
const env = process.env.NODE_ENV
// success message formate

const handleSuccessResponse = (data: any, message = 'success', code = 200) => {
  const resp = {
    success: true,
    message,
    data,
  };
  return JSON.stringify(resp);
};

// Error message handler and custom message for special error
const handleErrorResponse = async (sendResponse: any/* a method for sending the response */, error: any) => {
  let resp: any = {};
  // Handling Mongoose Validation Error
  if (error.error == 'castError') {
    resp.data = await handleMongooseValidationError(error);
    resp.status = 422
  }
  // handling duplicate key error
  else if (error.error && error.error.code && error.error.code == 11000) {
    resp.data = await handleDuplicateKeyError(error.error);
    resp.message = resp.data.error
    resp.status = 409
  }
  else if (error.name === 'JsonWebTokenError') {
    resp.data = 'Invalid or expired token. Please login again',
      resp.message = 'Invalid or expired token. Please login again',
      resp.status = 401
  }

  // Handling Expired JWT error
  else if (error.name === 'TokenExpiredError') {
    resp.data = 'Token expired, please login again',
      resp.message = 'Token expired, please login again',
      resp.status = 401
  }

  // handling api token and key error
  else if (error.name === 'InvalidTokenError') {
    resp.message = 'Invalid token.';
    resp.status = 401
    resp.data = error.data || ' Invalid token'
  }

  // handling JOI validation error
  else if (error.name === 'ValidationError') {
    resp.message = error.details[0].context.error || 'validation error';
    resp.status = 422
    resp.data = error.details
  }

  // Handle multer error
  else if (error.name === 'MulterError') {
    delete error.storageErrors
    resp.data = error;
    resp.message = error.message;
    resp.status = error.status;
    // if its file size error
    if (error.message = 'LIMIT_FILE_SIZE') {
      resp.status = error.code = 413
    }
    if (error.message = 'Unexpected field') {
      resp.status = error.code = 416
    }
  }
  // and finally 
  resp.success = false;
  if (env && env.toLocaleLowerCase() === 'production') {
    resp.errorStack = error.stack || error
  }
  if (resp.message == undefined) resp.message = error.message || 'Internal server error';
  if (resp.data == undefined) resp.data = error.details || error;
  if (resp.status == undefined) resp.status = error.status || error.statusCode || error.status || error.statusCode || error.code || 500
  // setStatus(resp.statusCode || 500 )
  return sendResponse(resp.status || 400, {...resp});
};

const handleDuplicateKeyError = async (err: any) => {
  const field = String(Object.keys(err.keyValue));
  const error = `An account with that ${field} already exists.`;
  return { field: field, error: error };
}

//handle field formatting, empty fields, and mismatched passwords
const handleMongooseValidationError = async (err: any) => {
  try {
    let errors = {};
    err.details.forEach((element: any) => {
      errors = { [element.context.label]: element.message, ...errors };

    });
    return errors
  } catch (ex: any) {
    return err;
  }
}
export { handleSuccessResponse, handleErrorResponse };
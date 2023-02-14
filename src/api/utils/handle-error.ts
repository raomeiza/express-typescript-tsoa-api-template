// Error Handler Class
class ErrorHandler extends Error {
  statusCode: number;
  constructor(message:any, statusCode:number) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

function throwError(message:any, statusCode?:number) {
  throw new ErrorHandler(message, statusCode || 400);
}

const handleCastErrorExceptionForInvalidObjectId = () => throwError('Invalid Parameter. Resource Not Found');

const isCastError = (error = '') => error.toString().indexOf('CastError') !== -1;

export { throwError, handleCastErrorExceptionForInvalidObjectId, isCastError };

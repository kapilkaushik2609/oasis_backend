import { v4 as uuidv4 } from 'uuid';
import { AppError } from './AppError.js';
import sanitize from 'sanitize-html'; // For input sanitization
import logger from '#config/logger.js';

// Static error messages
const ERROR_MESSAGES = {
  validationFailed: 'Validation failed',
  invalidField: (field, value) => `Invalid ${field}: ${value}`,
  invalidToken: 'Invalid token. Please login again.',
  tokenExpired: 'Your token has expired. Please login again.',
  rateLimitExceeded: 'Too many requests. Please try again later.',
  duplicateEntry: 'Duplicate entry found.',
};

export const errorHandler = ({
  req,
  res,
  statusCode = 500,
  message = 'Internal Server Error',
  error,
}) => {
  console.log('Error in errorHandler:', error);

  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  let errorDetails = {};
  let errorCode = `ERR-${statusCode}-${uuidv4().slice(0, 8)}`;

  // ✅ Guard: if no error object, return a generic response
  if (!error) {
    logger.error({
      correlationId,
      method: req.method,
      url: req.originalUrl,
      message,
      statusCode,
      errorCode,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      details: {},
      timestamp: new Date().toISOString(),
    });

    return res.status(statusCode).json({
      success: false,
      errorCode,
      message,
    });
  }

  // --- Prisma Error Handling ---
  if (error.code) {
    switch (error.code) {
      case 'P2002': // Unique constraint failed
        statusCode = 409;
        message = ERROR_MESSAGES.duplicateEntry;
        errorCode = 'ERR-DUPLICATE-409';
        errorDetails = {
          field:
            error.meta && error.meta.target
              ? error.meta.target.join(', ')
              : 'unknown',
        };
        break;

      case 'P2003': // Foreign key constraint failed
        statusCode = 400;
        message = ERROR_MESSAGES.invalidField(
          'foreign key',
          JSON.stringify(error.meta)
        );
        errorCode = 'ERR-FOREIGNKEY-400';
        break;

      case 'P2025': // Record not found
        statusCode = 404;
        message = 'Record not found';
        errorCode = 'ERR-NOT-FOUND-404';
        break;

      default:
        statusCode = 400;
        message = sanitize(error.message || ERROR_MESSAGES.validationFailed);
        errorCode = `ERR-PRISMA-${error.code}`;
        break;
    }
  }

  // JWT Errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = ERROR_MESSAGES.invalidToken;
    errorCode = 'ERR-JWT-INVALID-401';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = ERROR_MESSAGES.tokenExpired;
    errorCode = 'ERR-JWT-EXPIRED-401';
  }

  // Rate Limit Error
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    statusCode = 429;
    message = ERROR_MESSAGES.rateLimitExceeded;
    errorCode = 'ERR-RATE-LIMIT-429';
    errorDetails = { retryAfter: error.retryAfter || 60 };
  }

  // Custom App Error
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = sanitize(error.message);
    errorCode = `ERR-APP-${error.statusCode}`;
    errorDetails = { isOperational: error.isOperational };
  }

  // Fallback for native errors
  if (error instanceof Error && !errorDetails.message) {
    message = sanitize(error.message);
  }

  // Structured logging
  logger.error({
    correlationId,
    method: req.method,
    url: req.originalUrl,
    message,
    statusCode,
    errorCode,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    details: errorDetails,
    timestamp: new Date().toISOString(),
  });

  const response = {
    success: false,
    errorCode,
    message,
    ...(Object.keys(errorDetails).length > 0 && { details: errorDetails }),
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  };

  return res.status(statusCode).json(response);
};

export const successHandler = ({
  res,
  statusCode = 200,
  message = 'Success',
  data = null,
  error = null,
}) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    error,
  });
};

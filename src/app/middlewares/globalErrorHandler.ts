/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../interface/error';
import handleZodError from '../errors/handleZodErrors';
import config from '../config';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/appErrors';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let errorSource: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];



  if (err instanceof ZodError) {
    const simplifyError = handleZodError(err);
    statusCode = simplifyError?.statusCode;
    message = simplifyError?.message;
    errorSource = simplifyError?.errorSource;
  } else if (err.name === 'ValidationError') {
    const simplifyError = handleValidationError(err);
    statusCode = simplifyError.statusCode;
    errorSource = simplifyError.errorSource;
    message = simplifyError.message;
  } else if (err?.name === 'CastError') {
    const simplifyError = handleCastError(err);
    statusCode = simplifyError?.statusCode;
    message = simplifyError?.message;
    errorSource = simplifyError?.errorSource;
  } else if (err.code === 11000) {
    const simplifyError = handleDuplicateError(err);
    statusCode = simplifyError.statusCode;
    message = simplifyError.message;
    errorSource = simplifyError.errorSource;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSource = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSource = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    err,
    stack: config.node_env === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;


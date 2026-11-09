import type { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export const notFound: RequestHandler = (req, _res, next) => {
    next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    let statusCode = 500;
    let message = 'Internal server error';
    let details: unknown;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        details = err.details;
    } else if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Validation failed';
        details = err.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
    } else if (err instanceof mongoose.Error.CastError) {
        statusCode = 400;
        message = `Invalid value for "${err.path}"`;
    } else if (typeof err?.status === 'number' && err.status >= 400 && err.status < 500) {
        // Errors from body-parser (e.g. malformed JSON) carry an HTTP status
        statusCode = err.status;
        message = err.expose ? err.message : 'Bad request';
    }

    if (statusCode >= 500) {
        console.error('[ERROR]', err);
    }

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(details !== undefined && { details }),
            ...(env.NODE_ENV === 'development' && statusCode >= 500 && { stack: err.stack }),
        },
    });
};
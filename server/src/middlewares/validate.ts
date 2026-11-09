import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

/** Parses req.body against a schema. Throws ZodError, which the error handler maps to 400. */
export const validateBody =
    (schema: ZodType): RequestHandler =>
        (req, _res, next) => {
            req.body = schema.parse(req.body);
            next();
        };
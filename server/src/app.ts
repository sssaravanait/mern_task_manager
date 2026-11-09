import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler, notFound } from './middlewares/errorHandler';
import apiRouter from './routes/index';

export function createApp() {
    const app = express();

    app.use(helmet());                               // Secure HTTP headers
    app.use(cors({ origin: env.CLIENT_ORIGIN }));    // Only your frontend may call the API
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            limit: 300,
            standardHeaders: 'draft-7',
            legacyHeaders: false,
        }),
    );
    app.use(express.json({ limit: '100kb' }));      // Built-in body parser; caps payload size

    app.use('/api/v1', apiRouter);

    app.use(notFound);
    app.use(errorHandler);                          // Must be registered last

    return app;
}
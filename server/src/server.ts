import mongoose from 'mongoose';
import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled promise rejection:', reason);
    process.exit(1);
});

async function bootstrap() {
    await connectDB();

    const app = createApp();
    const server = app.listen(env.PORT, () => {
        console.log(`API running on http://localhost:${env.PORT}/api/v1`);
    });

    // Graceful shutdown: finish in-flight requests, then close the DB connection
    const shutdown = (signal: NodeJS.Signals) => {
        console.log(`${signal} received. Shutting down...`);
        server.close(async () => {
            await mongoose.disconnect();
            process.exit(0);
        });
    };

    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
}

bootstrap().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
import mongoose from 'mongoose';
import { env } from './env';

export async function connectDB(retries = 5, delayMs = 2000): Promise<void> {
    for (let attempt = 1; ; attempt++) {
        try {
            await mongoose.connect(env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
            console.log(`MongoDB connected: ${mongoose.connection.name}`);
            return;
        } catch (err) {
            if (attempt >= retries) throw err;
            console.warn(`MongoDB connection attempt ${attempt} failed. Retrying in ${delayMs}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
}
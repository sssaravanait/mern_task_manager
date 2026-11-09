import { Schema, model, type InferSchemaType } from 'mongoose';

const taskSchema = new Schema({
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    completed: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false,
});

// Index for the most common query: filter by status, sort by newest
taskSchema.index({ completed: 1, createdAt: -1 });

export type Task = InferSchemaType<typeof taskSchema>;
export const TaskModel = model<Task>('Task', taskSchema);
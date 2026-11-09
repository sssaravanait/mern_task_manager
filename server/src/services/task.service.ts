import { TaskModel } from '../models/task.model';
import { AppError } from '../utils/AppError';
import type { CreateTaskInput, UpdateTaskInput } from '../validators/task.validator';

interface ListParams {
    completed?: boolean;
    page: number;
    limit: number;
}

export const taskService = {
    async list({ completed, page, limit }: ListParams) {
        const filter: { completed?: boolean } = completed === undefined ? {} : { completed };

        // Run the page query and the count in parallel
        const [items, total] = await Promise.all([
            TaskModel.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            TaskModel.countDocuments(filter),
        ]);

        return {
            items,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    },

    async getById(id: string) {
        const task = await TaskModel.findById(id).lean();
        if (!task) throw new AppError(404, 'Task not found');
        return task;
    },

    create(data: CreateTaskInput) {
        return TaskModel.create(data);
    },

    async update(id: string, data: UpdateTaskInput) {
        const task = await TaskModel.findByIdAndUpdate(id, data, {
            returnDocument: 'after',
            runValidators: true,
        }).lean();
        if (!task) throw new AppError(404, 'Task not found');
        return task;
    },

    async remove(id: string) {
        const deleted = await TaskModel.findByIdAndDelete(id).lean();
        if (!deleted) throw new AppError(404, 'Task not found');
    },
};
import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(120),
    description: z.string().trim().max(1000).optional(),
    completed: z.boolean().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const listTasksQuery = z.object({
    completed: z
        .enum(['true', 'false'])
        .transform((v) => v === 'true')
        .optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const taskIdParams = z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid task id'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
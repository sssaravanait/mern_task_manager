import { z } from 'zod';

export const taskFormSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Title is required')
        .max(100, 'Title must be at most 100 characters'),
    description: z
        .string()
        .trim()
        .max(1000, 'Description must be at most 1000 characters'),
    completed: z.boolean(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
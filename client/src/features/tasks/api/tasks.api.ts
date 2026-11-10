import { http } from '@/lib/http';
import type { TaskFormValues } from '../schemas/task.schema';
import type { Task, TaskListParams, TaskPage } from '../types';

interface SuccessEnvelope<T> {
    success: true;
    data: T;
}

/** Builds ?page=1&limit=10&completed=false, leaving out undefined params. */
function buildListQuery(params: TaskListParams): string {
    const search = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit),
    });
    if (params.completed !== undefined) {
        search.set('completed', String(params.completed));
    }
    return search.toString();
}

// Plain functions with no React imports. They can be tested or reused on their own.
export const tasksApi = {
    list: (params: TaskListParams) =>
        http<TaskPage>(`/tasks?${buildListQuery(params)}`),

    create: (input: TaskFormValues) =>
        http<SuccessEnvelope<Task>>('/tasks', {
            method: 'POST',
            body: JSON.stringify(input),
        }).then((res) => res.data),

    update: (id: string, input: Partial<TaskFormValues>) =>
        http<SuccessEnvelope<Task>>(`/tasks/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(input),
        }).then((res) => res.data),

    remove: (id: string) => http<void>(`/tasks/${id}`, { method: 'DELETE' }),
};
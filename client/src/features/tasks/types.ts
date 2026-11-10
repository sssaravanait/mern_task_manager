export interface Task {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string; // JSON dates arrive as ISO strings, not Date objects
    updatedAt: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

/** Response of GET /tasks. The server spreads items and meta at the top level. */
export interface TaskPage {
    items: Task[];
    meta: PaginationMeta;
}

export interface TaskListParams {
    completed?: boolean;
    page: number;
    limit: number;
}
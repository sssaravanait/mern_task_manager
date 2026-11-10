const API_BASE_URL = '/api/v1';

/** Shape of the error body your Express error handler returns. */
interface ApiErrorBody {
    success: false;
    error: { message: string; details?: unknown };
}

/** An error from the API. Components can branch on `status`. */
export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string,
        public readonly details?: unknown,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    if (init.body !== undefined && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    let response: Response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
    } catch {
        // fetch only rejects on network failure (server down, offline), not on 4xx/5xx
        throw new ApiError(0, 'Cannot reach the server. Is the API running?');
    }

    // 204 No Content has no body, so calling .json() would fail
    if (response.status === 204) return undefined as T;

    const body: unknown = await response.json().catch(() => undefined);

    if (!response.ok) {
        const apiBody = body as ApiErrorBody | undefined;
        throw new ApiError(
            response.status,
            apiBody?.error?.message ?? `Request failed with status ${response.status}`,
            apiBody?.error?.details,
        );
    }

    return body as T;
}

/** Use in catch blocks to show a readable message from any thrown value. */
export function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Something went wrong';
}
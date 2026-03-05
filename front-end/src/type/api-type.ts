export interface ApiResponse<T = any> {
    statusCode: number;
    message: string;
    data: T;
    errors?: Record<string, string>;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

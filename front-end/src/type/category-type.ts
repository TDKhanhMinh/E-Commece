export interface Category {
    id: number;
    name: string;
    slug: string;
    level: number;
    children?: Category[];
}

export interface CategoryRequest {
    name: string;
    parentId?: number | null;
}

export interface CategorySearchParams {
    page?: number;
    size?: number;
    keyword?: string;
}

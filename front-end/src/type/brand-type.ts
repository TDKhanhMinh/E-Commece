export interface Brand {
    id: number;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
}

export interface BrandRequest {
    name: string;
    description?: string;
    logo?: string;
}

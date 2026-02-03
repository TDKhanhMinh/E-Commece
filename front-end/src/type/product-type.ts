// types/product-type.ts

export interface Attribute {
    id: number;
    name: string;
    code: string;
    type: "TEXT" | "SELECT" | "NUMBER";
}

export interface SpecDto {
    attributeName: string;
    value: string;
}

export interface SkuDto {
    id: number;
    skuCode: string;
    price: number;
    stock: number;
    discountPercent?: number; // Phần trăm giảm giá (0-100)
    salePrice?: number; // Giá sau khi giảm
    finalPrice?: number; // Giá cuối cùng (alias của salePrice)
    image: string;
    imagesDetails?: string[];
    attributes: Record<string, string>;
}

export interface ProductDetail {
    id: number;
    name: string;
    description: string;
    specifications: SpecDto[];
    variants: SkuDto[];
    configurableOptions: any[];
}

export interface ProductList {
    id: number;
    name: string;
    slug: string;
    image: string;
    minPrice: number;
    brandName: string;
    categoryName: string;
}

// --- REQUEST TYPES ---

export interface ProductRequest {
    name: string;
    categoryId: number;
    brandId: number;
    description: string;
    specs: { attributeId: number; value: string }[];
}

export interface SkuRequest {
    skuCode: string;
    price: number;
    stock: number;
    discountPercent?: number; // Phần trăm giảm giá (0-100)
    image: string;
    attributes: { attributeId: number; value: string }[];
}

export interface UpdateSkuRequest {
    price: number;
    stock: number;
    discountPercent?: number; // Phần trăm giảm giá (0-100)
    imageUrls?: string[];
}

export interface UpdateStockAndPriceSkuRequest {
    price: number;
    stock: number;
    discountPercent?: number; // Phần trăm giảm giá (0-100)
    images?: string[];
}
export interface AutoGenerateSkuRequest {
    price: number;
    stock: number;
    attributes: {
        attributeId: number;
        values: string[];
    }[];
}

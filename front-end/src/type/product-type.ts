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
    isActive: boolean;
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
export interface AutoGenerateSkuRequest {
    price: number;
    stock: number;
    attributes: {
        attributeId: number;
        values: string[];
    }[];
}
export interface ProductImageGalleryProps {
    images: string[];
    currentImageIndex: number;
    onImageChange: (index: number) => void;
    productName: string;
    discountPercent: number;
}
export interface ProductInfoProps {
    product: any;
    selectedSku: any;
    discountPercent: number;
    salePrice: number;
    originalPrice: number;
    attributeGroups: Record<string, Set<string>>;
    selectedAttributes: Record<string, string>;
    onAttributeChange: (attributeName: string, value: string) => void;
}
export interface ProductPriceProps {
    salePrice: number;
    originalPrice: number;
    discountPercent: number;
    className?: string;
}
export interface ProductSkuInfoProps {
    sku: {
        skuCode: string;
        stock: number;
    } | null;
}
export interface Specification {
    attributeName: string;
    value: string;
}

export interface ProductSpecificationsProps {
    specifications: Specification[];
}

export interface ProductStructuredDataProps {
    product: {
        name: string;
        description: string;
        image: string;
        brand?: string;
        rating?: number;
        reviewCount?: number;
    };
    sku: {
        skuCode: string;
        price: number;
        salePrice: number;
        stock: number;
    } | null;
    slug: string;
}

export interface ProductVariantSelectorProps {
    attributeGroups: Record<string, Set<string>>;
    selectedAttributes: Record<string, string>;
    onAttributeChange: (attributeName: string, value: string) => void;
    variants: any[];
}

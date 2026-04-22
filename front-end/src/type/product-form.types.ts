export interface ProductFormValues {
    name: string;
    description: string;
    categoryId: string;
    brandId: string;
    images: string[];
    specs: {
        attributeId: string;
        value: string;
        isInitial?: boolean;
    }[];
}

export interface ProductFormProps {
    productId?: number;
}

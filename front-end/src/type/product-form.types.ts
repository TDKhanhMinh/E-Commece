export interface ProductFormValues {
    name: string;
    description: string;
    categoryId: string;
    brandId: string;
    specs: {
        attributeId: string;
        value: string;
        isInitial?: boolean;
    }[];
}

export interface ProductFormProps {
    productId?: number;
}

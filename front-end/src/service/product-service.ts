import {
    ProductDetail,
    ProductRequest,
    SkuRequest,
    UpdateSkuRequest,
} from "@/type/product-type";
import http, { ApiResponse } from "@/service/http";

export interface AutoGenerateSkuRequest {
    price: number;
    stock: number;
    attributes: {
        attributeId: number;
        values: string[];
    }[];
}
// PRODUCT CRUD
export const getAllProducts = async (params: any) =>
    http.get<ApiResponse<any>>("/products", { params });

export const getProductById = async (id: number) =>
    http.get<ApiResponse<ProductDetail>>(`/products/${id}`);
export const getProductDetailsBySlug = async (slug: string) =>
    http.get<ApiResponse<ProductDetail>>(`/products/slug/${slug}`);

export const createProduct = async (data: ProductRequest) =>
    http.post<ApiResponse<ProductDetail>>("/products", data);

export const updateProduct = async (id: number, data: ProductRequest) => {
    console.log("Updating product:", id, data);
    return http.put<ApiResponse<ProductDetail>>(`/products/${id}`, data);
};

export const deleteProduct = async (id: number) =>
    http.delete<ApiResponse<void>>(`/products/${id}`);

// SKU CRUD
export const createSku = async (productId: number, data: SkuRequest) => {
    console.log("Creating SKU for product:", productId, data);
    return http.post<ApiResponse<void>>(`/products/${productId}/skus`, data);
};

export const autoCreateSku = async (
    productId: number,
    data: AutoGenerateSkuRequest
) => {
    console.log("Auto Creating SKU for product:", productId, data);

    return http.post<ApiResponse<void>>(
        `/products/${productId}/auto-generate`,
        data
    );
};
export const updateSku = async (skuId: number, data: SkuRequest) =>
    http.put<ApiResponse<void>>(`/skus/${skuId}`, data);

export const updateSkuDetails = async (
    productId: number,
    skuId: number,
    data: UpdateSkuRequest
) => http.put<ApiResponse<void>>(`/products/${productId}/sku/${skuId}`, data);

export const toggleSkuStatus = async (skuId: number, isActive: boolean) =>
    http.patch<ApiResponse<void>>(`/skus/${skuId}/status`, null, {
        params: { isActive },
    });

export const deleteSku = async (skuId: number) =>
    http.delete<ApiResponse<void>>(`/skus/${skuId}`);

"use client";

import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    autoCreateSku,
    createProduct,
    createSku,
    deleteProduct,
    deleteSku,
    getAllProducts,
    getProductById,
    updateProduct,
    updateSku,
    updateStockAndPriceSku,
} from "@/service/product-service";
import {
    AutoGenerateSkuRequest,
    ProductRequest,
    SkuRequest,
    UpdateStockAndPriceSkuRequest,
} from "@/type/product-type";
import { toast } from "sonner";

// ==========================================
// 1. QUERY HOOKS (GET DATA)
// ==========================================

/**
 * Hook lấy danh sách sản phẩm (Hỗ trợ phân trang, lọc, tìm kiếm)
 * @param params Object chứa: page, size, keyword, categoryId, brandId
 */
export const useProducts = (params: any) => {
    return useQuery({
        queryKey: ["products", params],
        queryFn: async () => {
            return await getAllProducts(params);
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60,
    });
};

/**
 * Hook lấy chi tiết sản phẩm (Bao gồm Specs và SKUs)
 * @param id ID sản phẩm
 */
export const useProductDetail = (id: number | null) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            if (!id) return null;

            return await getProductById(id);
        },
        enabled: !!id,
    });
};

// ==========================================
// 2. MUTATION HOOKS (CREATE/UPDATE/DELETE PRODUCT - SPU)
// ==========================================

/**
 * Hook tạo sản phẩm mới
 */
export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ProductRequest) => createProduct(data),
        onSuccess: () => {
            toast.success("Tạo sản phẩm thành công!");
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error: any) => {
            const msg = error.message || "Lỗi khi tạo sản phẩm";
            toast.error(msg);
        },
    });
};

/**
 * Hook cập nhật thông tin chung sản phẩm (SPU)
 */
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ProductRequest }) =>
            updateProduct(id, data),
        onSuccess: (data, variables) => {
            toast.success("Cập nhật sản phẩm thành công!");
            queryClient.invalidateQueries({
                queryKey: ["product", variables.id],
            });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error: any) => {
            const msg = error.message || "Lỗi khi cập nhật sản phẩm";
            toast.error(msg);
        },
    });
};

/**
 * Hook xóa sản phẩm
 */
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteProduct(id),
        onSuccess: () => {
            toast.success("Đã xóa sản phẩm và các biến thể liên quan!");
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error: any) => {
            const msg = error.message || "Không thể xóa sản phẩm này";
            toast.error(msg);
        },
    });
};

// ==========================================
// 3. SKU MUTATION HOOKS (NESTED SKUs)
// ==========================================

/**
 * Hook thêm SKU mới vào sản phẩm
 */
export const useCreateSku = (productId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: SkuRequest) => createSku(productId, data),
        onSuccess: () => {
            toast.success("Thêm biến thể SKU thành công!");
            queryClient.invalidateQueries({ queryKey: ["product", productId] });
        },
        onError: (error: any) => {
            console.log(error);
            const msg = error?.message || "Lỗi khi thêm SKU";
            toast.error(msg);
        },
    });
};

/**
 * Hook cập nhật SKU (Giá, Kho...)
 */
export const useUpdateSku = (productId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ skuId, data }: { skuId: number; data: SkuRequest }) =>
            updateSku(skuId, data),
        onSuccess: () => {
            toast.success("Cập nhật SKU thành công!");
            queryClient.invalidateQueries({ queryKey: ["product", productId] });
        },
        onError: (error: any) => {
            const msg = error.message || "Lỗi khi cập nhật SKU";
            toast.error(msg);
        },
    });
};

/**
 * Hook xóa SKU
 */
export const useDeleteSku = (productId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (skuId: number) => deleteSku(skuId),
        onSuccess: () => {
            toast.success("Đã xóa biến thể SKU!");
            queryClient.invalidateQueries({ queryKey: ["product", productId] });
        },
        onError: (error: any) => {
            const msg = error.message || "Lỗi khi xóa SKU";
            toast.error(msg);
        },
    });
};

export const useAutoGenerateProductSku = (productId: number) => {
    const queryClient = useQueryClient();

    const autoGenerateSkuMutation = useMutation({
        mutationFn: (data: AutoGenerateSkuRequest) =>
            autoCreateSku(productId, data),

        onSuccess: () => {
            toast.success("Auto generate SKU thành công");
            queryClient.invalidateQueries({ queryKey: ["product", productId] });
            queryClient.invalidateQueries({
                queryKey: ["skus", productId],
            });
        },

        onError: (error: any) => {
            toast.error(error?.message || "Auto generate SKU thất bại");
        },
    });

    return {
        autoGenerateSku: autoGenerateSkuMutation.mutate,
        isAutoGenerating: autoGenerateSkuMutation.isPending,
    };
};
export const useUpdateSkuPriceStock = (productId: number, skuId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateStockAndPriceSkuRequest) =>
            updateStockAndPriceSku(productId, skuId, payload),

        onSuccess: () => {
            toast.success("Cập nhật giá và tồn kho SKU thành công");
            queryClient.invalidateQueries({ queryKey: ["product", productId] });
            queryClient.invalidateQueries({
                queryKey: ["skus", productId],
            });
        },
        onError: (error: any) => {
            toast.error(
                error?.message || "Cập nhật giá và tồn kho SKU thất bại"
            );
        },
    });
};

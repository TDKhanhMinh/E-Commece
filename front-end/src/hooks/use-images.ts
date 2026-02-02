import { useMutation } from "@tanstack/react-query";
import {
    deleteImageByUrl,
    uploadMultipleImages,
} from "@/service/image-service";

export const useUploadImages = () =>
    useMutation({
        mutationFn: uploadMultipleImages,
        onError: (error) => {
            const msg = error?.message || "Lỗi khi tải hình ảnh";
            console.error(msg);
        },
    });

export const useDeleteImage = () =>
    useMutation({
        mutationFn: deleteImageByUrl,
        onError: (error) => {
            const msg = error?.message || "Lỗi khi xóa hình ảnh";
            console.error(msg);
        },
    });

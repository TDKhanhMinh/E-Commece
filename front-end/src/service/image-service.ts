// src/api/image-api.ts

import http from "@/service/http";

export const uploadSingleImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return await http.post<string>("/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const uploadMultipleImages = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    return await http.post<string[]>("/images/upload-multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const deleteImageByUrl = async (url: string) => {
    return http.delete("/images", {
        params: { url },
    });
};

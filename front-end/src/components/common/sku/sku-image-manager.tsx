"use client";

import { Loader2, Upload, X } from "lucide-react";
import React, { memo, useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDeleteImage, useUploadImages } from "@/hooks/use-images";

interface SkuImageManagerProps {
    value: string[];
    onChange: (images: string[]) => void;
    isUploading?: boolean;
    onUploadingChange: (value: boolean) => void;
}

interface ImagePreviewProps {
    url: string;
    onRemove: (url: string) => void;
}

const ImagePreview = memo(function ImagePreview({
    url,
    onRemove,
}: ImagePreviewProps) {
    return (
        <div className="group relative rounded border dark:border-slate-800">
            <img
                src={url}
                alt="SKU product image"
                className="h-24 w-full rounded object-cover"
            />
            <button
                type="button"
                onClick={() => onRemove(url)}
                className="absolute top-1 right-1 hidden rounded-full bg-black/60 p-1 text-white transition-opacity group-hover:block hover:bg-black/80"
                aria-label="Xóa hình ảnh"
            >
                <X className="h-3 w-3" />
            </button>
        </div>
    );
});

export function SkuImageManager({
    value,
    onChange,
    isUploading,
    onUploadingChange,
}: SkuImageManagerProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const uploadMutation = useUploadImages();
    const deleteMutation = useDeleteImage();

    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleSelectFiles = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);
            if (files.length === 0) return;

            try {
                setUploadError(null);
                onUploadingChange(true);

                const urls = await uploadMutation.mutateAsync(files);

                const newImages: string[] = [
                    ...value,
                    ...(urls as any as string[]),
                ];
                onChange(newImages);
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Không thể tải lên hình ảnh. Vui lòng thử lại.";
                setUploadError(errorMessage);
                console.error("Error uploading images:", error);
            } finally {
                onUploadingChange(false);
                if (inputRef.current) {
                    inputRef.current.value = "";
                }
            }
        },
        [value, onChange, onUploadingChange, uploadMutation]
    );

    const handleRemove = useCallback(
        async (url: string) => {
            try {
                await deleteMutation.mutateAsync(url);
                onChange(value.filter((img) => img !== url));
            } catch (error) {
                console.error("Error deleting image:", error);
            }
        },
        [value, onChange, deleteMutation]
    );

    const isUploading_internal = uploadMutation.isPending || isUploading;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Hình ảnh SKU</span>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading_internal}
                    className="flex items-center gap-2"
                    aria-label="Tải lên hình ảnh SKU"
                >
                    {uploadMutation.isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Đang tải...
                        </>
                    ) : (
                        <>
                            <Upload className="h-4 w-4" />
                            Upload
                        </>
                    )}
                </Button>
            </div>

            <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={handleSelectFiles}
                aria-label="Chọn hình ảnh để tải lên"
            />

            {uploadError && (
                <div
                    className="rounded-md border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-2 text-xs text-red-600 dark:text-red-400"
                    role="alert"
                >
                    {uploadError}
                </div>
            )}

            {value.length === 0 && (
                <p className="text-muted-foreground text-xs">
                    Chưa có hình ảnh nào
                </p>
            )}

            <div className={`grid grid-cols-4 gap-3`}>
                {value.map((url) => (
                    <ImagePreview key={url} url={url} onRemove={handleRemove} />
                ))}
            </div>
        </div>
    );
}

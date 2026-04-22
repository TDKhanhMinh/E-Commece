"use client";

import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import React, { memo, useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDeleteImage, useUploadImages } from "@/hooks/use-images";

interface ProductImageManagerProps {
    value: string[];
    onChange: (images: string[]) => void;
    isUploading?: boolean;
    onUploadingChange: (value: boolean) => void;
}

interface ImagePreviewProps {
    url: string;
    index: number;
    onRemove: (url: string) => void;
    onSetMain: (index: number) => void;
    isMain: boolean;
}

const ImagePreview = memo(function ImagePreview({
    url,
    index,
    onRemove,
    onSetMain,
    isMain,
}: ImagePreviewProps) {
    return (
        <div
            className={`group relative rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                isMain
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-primary/50"
            }`}
            onClick={() => onSetMain(index)}
        >
            <img
                src={url}
                alt={`Product image ${index + 1}`}
                className="h-32 w-full object-cover"
            />
            {isMain && (
                <div className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-xs text-center py-1">
                    Ảnh chính
                </div>
            )}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(url);
                }}
                className="absolute top-2 right-2 hidden rounded-full bg-black/60 p-1.5 text-white transition-opacity group-hover:block hover:bg-black/80"
                aria-label="Xóa hình ảnh"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
});

export const ProductImageManager = memo(function ProductImageManager({
    value,
    onChange,
    isUploading,
    onUploadingChange,
}: ProductImageManagerProps) {
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

    const handleSetMain = useCallback(
        (index: number) => {
            if (index === 0) return;
            const newImages = [...value];
            const [selectedImage] = newImages.splice(index, 1);
            newImages.unshift(selectedImage);
            onChange(newImages);
        },
        [value, onChange]
    );

    const isUploading_internal = uploadMutation.isPending || isUploading;

    return (
        <Card className="dark:bg-slate-950 dark:border-slate-800">
            <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">
                            Hình ảnh sản phẩm
                        </span>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => inputRef.current?.click()}
                        disabled={isUploading_internal}
                        className="flex items-center gap-2"
                        aria-label="Tải lên hình ảnh sản phẩm"
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
                        className="rounded-md border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-600 dark:text-red-400"
                        role="alert"
                    >
                        {uploadError}
                    </div>
                )}

                {value.length === 0 ? (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground text-sm">
                            Chưa có hình ảnh nào
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">
                            Click vào nút Upload để thêm hình ảnh
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-xs text-muted-foreground">
                            Click vào hình ảnh để đặt làm ảnh chính
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {value.map((url, index) => (
                                <ImagePreview
                                    key={url}
                                    url={url}
                                    index={index}
                                    onRemove={handleRemove}
                                    onSetMain={handleSetMain}
                                    isMain={index === 0}
                                />
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
});

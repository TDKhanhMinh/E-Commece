"use client";

import { Loader2, Upload, X } from "lucide-react";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useDeleteImage, useUploadImages } from "@/hooks/use-images";

interface SkuImageManagerProps {
    value: string[];
    onChange: (images: string[]) => void;
    isUploading?: boolean;
    onUploadingChange: (value: boolean) => void;
}

export function SkuImageManager({
    value,
    onChange,
    isUploading,
    onUploadingChange,
}: SkuImageManagerProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const uploadMutation = useUploadImages();
    const deleteMutation = useDeleteImage();

    const handleSelectFiles = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        try {
            onUploadingChange(true);
            const urls = await uploadMutation.mutateAsync(files);
            // @ts-ignore
            onChange([...value, ...urls]);
        } catch (error) {
            console.log("Error uploading images:", error);
        } finally {
            onUploadingChange(false);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    const handleRemove = async (url: string) => {
        await deleteMutation.mutateAsync(url);
        onChange(value.filter((img) => img !== url));
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Hình ảnh SKU</span>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploadMutation.isPending || isUploading}
                    className="flex items-center gap-2"
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
            />

            {value.length === 0 && (
                <p className="text-muted-foreground text-xs">
                    Chưa có hình ảnh nào
                </p>
            )}

            <div className="grid grid-cols-4 gap-3">
                {value.map((url) => (
                    <div key={url} className="group relative rounded border">
                        <img
                            src={url}
                            alt="sku"
                            className="h-24 w-full rounded object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(url)}
                            className="absolute top-1 right-1 hidden rounded-full bg-black/60 p-1 text-white group-hover:block"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

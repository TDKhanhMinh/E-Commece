import ProductForm from "@/components/common/product-form";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params;

    return <ProductForm productId={Number(id)} />;
}

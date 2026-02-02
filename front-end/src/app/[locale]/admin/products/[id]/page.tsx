import ProductForm from "@/components/common/product-form";
export default function EditProductPage({
    params,
}: {
    params: { id: string };
}) {
    return (
        <div className="p-8">
            <ProductForm productId={Number(params.id)} />
        </div>
    );
}

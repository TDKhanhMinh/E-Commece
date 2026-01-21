import ProductItem from "@/components/common/product-item";
import { MOCK_CAROUSEL_PRODUCT_ITEMS } from "../../../../../mock";

function Collection() {
    return (
        <div className="mx-8 w-full">
            <div className="container flex max-w-5xl flex-row items-center justify-between py-2 pr-5">
                <h3 className="w-full py-2 text-xl font-bold">50 products</h3>
                <select className="rounded-md border border-gray-300 px-4 py-2">
                    <option value="relevance">Sort by relevance</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="newest-first">Newest First</option>
                </select>
            </div>
            <div className="flex flex-row flex-wrap space-x-5">
                {MOCK_CAROUSEL_PRODUCT_ITEMS.map((product) => (
                    <div key={product.id} className="col-span-3 flex flex-col">
                        <ProductItem item={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Collection;

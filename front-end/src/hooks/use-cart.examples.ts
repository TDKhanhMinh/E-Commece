/**
 * HƯỚNG DẪN SỬ DỤNG USE-CART HOOKS
 *
 * File này chứa các ví dụ về cách sử dụng các cart hooks với TanStack Query
 */

// ==========================================
// 1. HIỂN THỊ GIỎ HÀNG
// ==========================================

/*
import { useCart, useCartSummary } from "@/hooks/use-cart";

export function CartDisplay() {
    const { data: cart, isLoading, error } = useCart();
    const summary = useCartSummary();

    if (isLoading) return <div>Đang tải giỏ hàng...</div>;
    if (error) return <div>Lỗi tải giỏ hàng</div>;

    return (
        <div>
            <h2>Giỏ hàng của bạn</h2>
            <p>Tổng sản phẩm: {summary.itemCount}</p>
            <p>Tổng tiền: {summary.totalAmount.toLocaleString()}₫</p>
            <p>Giảm giá: {summary.totalDiscount.toLocaleString()}₫</p>
            <p>Thành tiền: {summary.finalAmount.toLocaleString()}₫</p>

            {cart?.items.map(item => (
                <div key={item.id}>
                    <img src={item.productImage} alt={item.productName} />
                    <h3>{item.productName}</h3>
                    <p>SKU: {item.skuCode}</p>
                    <p>Giá: {item.price.toLocaleString()}₫</p>
                    <p>Số lượng: {item.quantity}</p>
                </div>
            ))}
        </div>
    );
}
*/

// ==========================================
// 2. THÊM SẢN PHẨM VÀO GIỎ HÀNG
// ==========================================

/*
import { useAddToCart } from "@/hooks/use-cart";

export function ProductCard({ sku }) {
    const addToCart = useAddToCart();

    const handleAddToCart = () => {
        addToCart.mutate({
            skuId: sku.id,
            quantity: 1
        });
    };

    return (
        <div>
            <h3>{sku.productName}</h3>
            <button
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
            >
                {addToCart.isPending ? "Đang thêm..." : "Thêm vào giỏ"}
            </button>
        </div>
    );
}
*/

// ==========================================
// 3. CẬP NHẬT SỐ LƯỢNG
// ==========================================

/*
import { useUpdateCartItem } from "@/hooks/use-cart";

export function CartItem({ item }) {
    const updateItem = useUpdateCartItem();

    const handleUpdateQuantity = (newQuantity: number) => {
        if (newQuantity > 0 && newQuantity <= item.maxStock) {
            updateItem.mutate({
                skuId: item.skuId,
                quantity: newQuantity
            });
        }
    };

    return (
        <div>
            <p>{item.productName}</p>
            <div>
                <button onClick={() => handleUpdateQuantity(item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleUpdateQuantity(item.quantity + 1)}>+</button>
            </div>
        </div>
    );
}
*/

// ==========================================
// 4. XÓA SẢN PHẨM KHỎI GIỎ
// ==========================================

/*
import { useRemoveCartItem } from "@/hooks/use-cart";

export function CartItem({ item }) {
    const removeItem = useRemoveCartItem();

    const handleRemove = () => {
        if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            removeItem.mutate(item.skuId);
        }
    };

    return (
        <div>
            <p>{item.productName}</p>
            <button
                onClick={handleRemove}
                disabled={removeItem.isPending}
            >
                {removeItem.isPending ? "Đang xóa..." : "Xóa"}
            </button>
        </div>
    );
}
*/

// ==========================================
// 5. XÓA TOÀN BỘ GIỎ HÀNG
// ==========================================

/*
import { useClearCart } from "@/hooks/use-cart";

export function CartActions() {
    const clearCart = useClearCart();

    const handleClearCart = () => {
        if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
            clearCart.mutate();
        }
    };

    return (
        <button
            onClick={handleClearCart}
            disabled={clearCart.isPending}
        >
            {clearCart.isPending ? "Đang xóa..." : "Xóa toàn bộ giỏ hàng"}
        </button>
    );
}
*/

// ==========================================
// 6. HỢP NHẤT GIỎ HÀNG SAU KHI LOGIN
// ==========================================

/*
import { useMergeCart } from "@/hooks/use-cart";
import { useEffect } from "react";

export function useGuestCartMerge() {
    const mergeCart = useMergeCart();

    useEffect(() => {
        // Lấy giỏ hàng guest từ localStorage sau khi login
        const guestCart = localStorage.getItem("guestCart");

        if (guestCart) {
            const items = JSON.parse(guestCart);
            mergeCart.mutate(items, {
                onSuccess: () => {
                    // Xóa giỏ hàng guest sau khi merge thành công
                    localStorage.removeItem("guestCart");
                }
            });
        }
    }, []);
}
*/

// ==========================================
// 7. SỬ DỤNG CART SUMMARY TRONG HEADER
// ==========================================

/*
import { useCartSummary } from "@/hooks/use-cart";

export function CartIcon() {
    const { itemCount, finalAmount } = useCartSummary();

    return (
        <div className="cart-icon">
            <ShoppingCartIcon />
            {itemCount > 0 && (
                <span className="badge">{itemCount}</span>
            )}
            <span className="amount">
                {finalAmount.toLocaleString()}₫
            </span>
        </div>
    );
}
*/

// ==========================================
// 8. FULL EXAMPLE: CART PAGE
// ==========================================

/*
import {
    useCart,
    useCartSummary,
    useUpdateCartItem,
    useRemoveCartItem,
    useClearCart
} from "@/hooks/use-cart";

export function CartPage() {
    const { data: cart, isLoading } = useCart();
    const summary = useCartSummary();
    const updateItem = useUpdateCartItem();
    const removeItem = useRemoveCartItem();
    const clearCart = useClearCart();

    if (isLoading) return <div>Đang tải...</div>;
    if (!cart || cart.items.length === 0) {
        return <div>Giỏ hàng trống</div>;
    }

    return (
        <div className="cart-page">
            <header>
                <h1>Giỏ hàng ({summary.itemCount} sản phẩm)</h1>
                <button onClick={() => clearCart.mutate()}>
                    Xóa tất cả
                </button>
            </header>

            <div className="cart-items">
                {cart.items.map(item => (
                    <div key={item.id} className="cart-item">
                        <img src={item.productImage} alt={item.productName} />

                        <div className="item-info">
                            <h3>{item.productName}</h3>
                            <p>SKU: {item.skuCode}</p>
                            <p>
                                {Object.entries(item.attributes).map(([key, value]) => (
                                    <span key={key}>{value} </span>
                                ))}
                            </p>
                        </div>

                        <div className="item-price">
                            {item.discountPercent && (
                                <span className="original-price">
                                    {item.price.toLocaleString()}₫
                                </span>
                            )}
                            <span className="sale-price">
                                {(item.salePrice || item.price).toLocaleString()}₫
                            </span>
                        </div>

                        <div className="item-quantity">
                            <button
                                onClick={() => updateItem.mutate({
                                    skuId: item.skuId,
                                    quantity: item.quantity - 1
                                })}
                                disabled={item.quantity <= 1}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={item.quantity}
                                min={1}
                                max={item.maxStock}
                                onChange={(e) => {
                                    const qty = parseInt(e.target.value);
                                    if (qty >= 1 && qty <= item.maxStock) {
                                        updateItem.mutate({
                                            skuId: item.skuId,
                                            quantity: qty
                                        });
                                    }
                                }}
                            />
                            <button
                                onClick={() => updateItem.mutate({
                                    skuId: item.skuId,
                                    quantity: item.quantity + 1
                                })}
                                disabled={item.quantity >= item.maxStock}
                            >
                                +
                            </button>
                        </div>

                        <div className="item-subtotal">
                            {item.subtotal.toLocaleString()}₫
                        </div>

                        <button
                            className="remove-btn"
                            onClick={() => removeItem.mutate(item.skuId)}
                        >
                            Xóa
                        </button>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <div className="summary-row">
                    <span>Tạm tính:</span>
                    <span>{summary.totalAmount.toLocaleString()}₫</span>
                </div>
                {summary.totalDiscount > 0 && (
                    <div className="summary-row discount">
                        <span>Giảm giá:</span>
                        <span>-{summary.totalDiscount.toLocaleString()}₫</span>
                    </div>
                )}
                <div className="summary-row total">
                    <span>Tổng cộng:</span>
                    <span>{summary.finalAmount.toLocaleString()}₫</span>
                </div>
                <button className="checkout-btn">
                    Thanh toán
                </button>
            </div>
        </div>
    );
}
*/

export {};

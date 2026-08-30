"use client";
import { useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { CartItem } from "@/components/pages/cart/fragments/cart-item";
import { EmptyCart } from "@/components/pages/cart/fragments/empty-cart";
import { BillSummary } from "@/components/pages/cart/fragments/bill-summary";
import { CheckoutFooter } from "@/components/pages/cart/fragments/checkout-footer";

export default function CartPage() {
    const router = useRouter();
    const cartItems = useSelector(state => state.cart.items);
    const subtotal = cartItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const gst = Math.round(subtotal * 0.05);
    const platformFee = 5;
    const grandTotal = subtotal > 0 ? subtotal + gst + platformFee : 0;

    return (
        <div className="min-h-screen bg-gray-50 pb-[100px] md:pb-[120px]">
            <div className="sticky top-0 z-40 flex items-center gap-4 bg-white px-4 py-4 shadow-sm">
                <button
                    onClick={() => router.back()}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-900" />
                </button>
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">Cart</h1>
            </div>

            <main className="mx-auto max-w-screen-sm px-4 pt-5">
                {cartItems.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-[14px] font-bold tracking-widest text-gray-400 uppercase ml-1">
                                Your Items
                            </h2>
                            {cartItems.map((cartItem) => (
                                <CartItem key={cartItem.cartItemId || cartItem.item._id} cartItem={cartItem} />
                            ))}
                        </div>
                        <BillSummary subtotal={subtotal} />
                    </div>
                )}
            </main>

            {cartItems.length > 0 && (
                <CheckoutFooter grandTotal={grandTotal} />
            )}
        </div>
    );
}

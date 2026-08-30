"use client";
import { useSelector } from "react-redux";
import { ArrowRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CartBar() {
    const router = useRouter();
    const cartItems = useSelector((state) => state.cart.items);
    if (!cartItems || cartItems.length === 0) return null;
    const totalItems = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

    return (
        <div className="fixed bottom-[50px] md:bottom-0 left-0 right-0 z-50 p-4 flex justify-center animate-in slide-in-from-bottom-10 fade-in duration-300">
            <button onClick={() => router.push('/cart')} className="flex w-full max-w-screen-sm items-center justify-between rounded-md bg-white border border-gray-150 p-2.5 pl-4 pr-2.5 text-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all hover:bg-gray-50 active:scale-[0.98]">
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                        {cartItems.slice(0, 2).map((cartItem, idx) => (
                            <div
                                key={cartItem.item._id || cartItem.item.id || idx}
                                className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm"
                            >
                                {cartItem.item?.image ? (
                                    <img
                                        src={getImageUrl(cartItem.item.image, true, "thumbnail")}
                                        alt={cartItem.item.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-orange-100 text-sm font-bold text-orange-500">
                                        {cartItem.item?.name?.charAt(0) || "I"}
                                    </div>
                                )}
                            </div>
                        ))}
                        {cartItems.length > 2 && (
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-bold text-gray-600 shadow-sm">
                                +{cartItems.length - 2}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-start justify-center">
                        <span className="font-heading text-[15px] font-bold tracking-wide text-gray-900">
                            {totalItems} ITEM{totalItems > 1 ? "S" : ""}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 rounded-md bg-primary py-2.5 pl-4 pr-3 font-heading text-[13px] font-bold tracking-wider text-white shadow-md transition-colors hover:bg-primary/95">
                    Continue
                    <div className="flex items-center justify-center text-white">
                        <ArrowRight size={16} strokeWidth={2.5} />
                    </div>
                </div>
            </button>
        </div>
    );
}

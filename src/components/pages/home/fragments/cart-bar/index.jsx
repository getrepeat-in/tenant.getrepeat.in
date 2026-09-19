"use client";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { PromotionService } from "@/services/frontend/promotion";
import { ItemImage } from "@/components/global/item-image";

export default function CartBar() {
    const router = useRouter();
    const { slug } = useRestaurant();
    const cartItems = useSelector((state) => state.cart.items);
    const [isMounted, setIsMounted] = useState(false);

    const { data: promotions = [] } = useQuery({
        queryKey: ["promotions", slug],
        queryFn: async () => {
            const response = await PromotionService.getAll(slug);
            return response?.data || response || [];
        },
        enabled: !!slug,
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || !cartItems || cartItems.length === 0) return null;

    const totalItems = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
    const cartTotal = cartItems.reduce((acc, curr) => {
        const price = curr.item?.base_price || curr.item?.price || 0;
        return acc + (price * curr.quantity);
    }, 0);

    const activePromos = promotions
        .filter(p => (!p.status || p.status === 'ACTIVE') && p.min_order_value > 0)
        .sort((a, b) => a.min_order_value - b.min_order_value);

    let displayPromo = null;
    let isAchieved = false;
    let text = "";
    let progress = 0;

    const lockedPromos = activePromos.filter(p => p.min_order_value > cartTotal);
    const unlockedPromos = activePromos.filter(p => p.min_order_value <= cartTotal);

    if (unlockedPromos.length > 0) {
        const latestUnlocked = unlockedPromos[unlockedPromos.length - 1];
        displayPromo = latestUnlocked;
        isAchieved = true;
        text = `🎉 ${latestUnlocked.title || latestUnlocked.code || 'Offer'} Unlocked!`;
        progress = 100;
    } else if (lockedPromos.length > 0) {
        displayPromo = lockedPromos[0];
        isAchieved = false;
        const diff = displayPromo.min_order_value - cartTotal;
        text = `Add ₹${diff} more to unlock offer`;
        progress = Math.min(100, (cartTotal / displayPromo.min_order_value) * 100);
    }

    return (
        <div className="fixed bottom-[50px] md:bottom-0 left-0 right-0 z-50 p-4 flex flex-col items-center justify-end pointer-events-none animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="w-full max-w-screen-sm pointer-events-auto flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-150">
                {displayPromo && (
                    <button 
                        onClick={() => router.push('/cart')}
                        className={cn(
                            "relative w-full flex items-center justify-between p-3 transition-all duration-300 active:bg-gray-50 border-b",
                            isAchieved 
                                ? "bg-green-50 border-green-200" 
                                : "bg-white border-gray-100"
                        )}
                    >
                        {/* Progress Bar Background */}
                        {!isAchieved && (
                            <div 
                                className="absolute left-0 top-0 bottom-0 bg-primary/10 transition-all duration-500 ease-out" 
                                style={{ width: `${progress}%` }} 
                            />
                        )}
                        
                        <div className="relative z-10 flex items-center gap-2">
                            <Sparkles className={cn("w-4 h-4", isAchieved ? "text-green-600" : "text-primary")} />
                            <span className={cn(
                                "text-[13px] font-bold tracking-tight",
                                isAchieved ? "text-green-700" : "text-gray-700"
                            )}>
                                {text}
                            </span>
                        </div>

                        <div className="relative z-10 flex items-center">
                            <span className={cn(
                                "text-[11px] font-bold uppercase tracking-wider",
                                isAchieved ? "text-green-700" : "text-primary"
                            )}>
                                {isAchieved ? "Claim" : "View"}
                            </span>
                        </div>
                    </button>
                )}

                <button onClick={() => router.push('/cart')} className="flex w-full items-center justify-between bg-white p-2.5 pl-4 pr-2.5 text-gray-900 transition-all hover:bg-gray-50 active:bg-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                            {cartItems.slice(0, 2).map((cartItem, idx) => {
                                const itemImg = cartItem?.image || cartItem?.item?.image || cartItem?.item?.img;
                                const itemName = cartItem?.name || cartItem?.item?.name || "Cart Item";
                                const itemKey = cartItem?.cartItemId || cartItem?._id || cartItem?.item?._id || cartItem?.item?.id || idx;

                                return (
                                    <div
                                        key={itemKey}
                                        className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm shrink-0"
                                    >
                                        <ItemImage
                                            src={itemImg}
                                            alt={itemName}
                                            variant="thumbnail"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                );
                            })}
                            {cartItems.length > 2 && (
                                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-bold text-gray-600 shadow-sm shrink-0">
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

                    <div className="flex items-center gap-2 rounded-xl bg-primary py-2.5 pl-4 pr-3 font-heading text-[13px] font-bold tracking-wider text-primary-foreground shadow-md transition-colors hover:bg-primary/95">
                        Continue
                        <div className="flex items-center justify-center">
                            <ArrowRight size={16} strokeWidth={2.5} />
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}

"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRestaurant } from "@/hooks/useRestaurant";
import { ItemImage } from "@/components/global/common/item-image";
import DiaterySymbol from "@/components/global/common/diatery-symbol";
import VariantDrawer from "@/components/global/common/variant-drawer";
import { addItem, updateQuantity } from "@/store/slices/cartSlice";

export default function ItemCardV1({ item, promo, title, price, description, image, badge, units, buttonText = "Add", onAdd, className = "" }) {
    const dispatch = useDispatch();
    const { restaurant } = useRestaurant();
    const cartItems = useSelector((state) => state.cart.items);

    const [isVariantDrawerOpen, setIsVariantDrawerOpen] = useState(false);
    const itemData = item || {};
    const itemTitle = title || itemData.name || itemData.title || "";
    const itemImage = image || itemData.image;
    const basePrice =
        price || itemData.price || itemData.base_price || itemData.defaultPrice || 0;

    let finalPrice = basePrice;
    if (promo) {
        if (
            promo.discount_type === "PERCENTAGE" ||
            promo.discount_type === "PERCENTAGE_DISCOUNT"
        ) {
            finalPrice = basePrice - basePrice * (promo.discount_value / 100);
        } else if (
            promo.discount_type === "FLAT" ||
            promo.discount_type === "FLAT_DISCOUNT"
        ) {
            finalPrice = basePrice - promo.discount_value;
        }
        finalPrice = Math.max(0, finalPrice);
    } else if (
        itemData.discounted_price !== undefined &&
        itemData.discounted_price < basePrice
    ) {
        finalPrice = itemData.discounted_price;
    }
    const hasDiscount = finalPrice < basePrice;

    const itemBadge =
        badge || (promo?.type === "BESTSELLER" ? "Bestseller" : itemData.badge);
    const dietaryType = itemData.dietaryType || itemData.dietary_type;

    const hasCustomizations =
        (itemData.variants && itemData.variants.length > 0) ||
        (itemData.addonGroups && itemData.addonGroups.length > 0);

    const totalItemQuantity = cartItems
        .filter((i) => i.item?._id === itemData._id)
        .reduce((sum, current) => sum + current.quantity, 0);

    const simpleCartItem = cartItems.find(
        (i) =>
            i.cartItemId === itemData._id ||
            (i.item?._id === itemData._id &&
                (!i.selectedCustomizations ||
                    Object.keys(i.selectedCustomizations).length === 0))
    );
    const simpleQuantity = simpleCartItem?.quantity || 0;

    const handleAdd = (e) => {
        if (e) e.stopPropagation();
        if (onAdd) {
            onAdd();
            return;
        }
        if (hasCustomizations) {
            setIsVariantDrawerOpen(true);
        } else {
            dispatch(
                addItem({
                    item: itemData,
                    restaurantId: restaurant?._id || restaurant?.id,
                    selectedCustomizations: {},
                })
            );
        }
    };

    const handleUpdate = (e, newQuantity) => {
        if (e) e.stopPropagation();
        if (hasCustomizations) {
            setIsVariantDrawerOpen(true);
        } else {
            dispatch(
                updateQuantity({ itemId: itemData._id, quantity: newQuantity })
            );
        }
    };

    return (
        <>
            <article
                onClick={() => setIsVariantDrawerOpen(true)}
                className={cn(
                    "group flex flex-col justify-between w-full overflow-hidden rounded-md bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all duration-300 p-2.5 sm:p-3 select-none cursor-pointer",
                    className
                )}
            >
                <div className="flex flex-col w-full">
                    <div className="relative aspect-[4/3] w-full rounded-md overflow-hidden bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-800">
                        {itemBadge && (
                            <div className="absolute top-1.5 left-1.5 z-10 bg-[#e91e63] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                                {itemBadge}
                            </div>
                        )}
                        <ItemImage
                            src={itemImage}
                            alt={itemTitle}
                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                    </div>

                    <div className="flex items-center gap-1.5 mt-2.5 min-w-0">
                        {dietaryType && (
                            <div className="shrink-0 flex items-center justify-center">
                                <DiaterySymbol type={dietaryType} size={15} />
                            </div>
                        )}
                        <h4
                            title={itemTitle}
                            className="text-[14px] sm:text-[15px] font-bold text-gray-900 dark:text-zinc-100 truncate tracking-tight flex-1 leading-normal"
                        >
                            {itemTitle}
                        </h4>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-0.5 gap-2">
                    <div className="flex items-center gap-1.5 shrink-0">
                        {hasDiscount ? (
                            <>
                                <span className="text-[15px] sm:text-[16px] font-bold text-gray-900 dark:text-zinc-100 leading-none">
                                    ₹{finalPrice.toFixed(2).replace(/\.00$/, "")}
                                </span>
                                <span className="text-[11px] text-gray-400 line-through leading-none">
                                    ₹{basePrice}
                                </span>
                            </>
                        ) : (
                            <span className="text-[15px] sm:text-[16px] font-bold text-gray-900 dark:text-zinc-100 leading-none">
                                ₹{basePrice}
                            </span>
                        )}
                    </div>

                    <div className="shrink-0 flex items-center">
                        {!hasCustomizations && simpleQuantity > 0 ? (
                            <div className="flex h-[32px] w-[82px] items-center justify-between rounded-md bg-primary text-primary-foreground font-semibold overflow-hidden shadow-xs">
                                <button
                                    type="button"
                                    onClick={(e) =>
                                        handleUpdate(e, simpleQuantity - 1)
                                    }
                                    className="flex h-full w-[26px] items-center justify-center hover:bg-black/10 active:bg-black/20 transition-colors text-primary-foreground text-[15px] font-semibold"
                                >
                                    <span className="leading-none select-none">-</span>
                                </button>
                                <span className="flex-1 text-center text-[13px] font-semibold text-primary-foreground select-none flex items-center justify-center">
                                    {simpleQuantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) =>
                                        handleUpdate(e, simpleQuantity + 1)
                                    }
                                    className="flex h-full w-[26px] items-center justify-center hover:bg-black/10 active:bg-black/20 transition-colors text-primary-foreground text-[15px] font-semibold"
                                >
                                    <span className="leading-none select-none">+</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="relative flex h-[32px] min-w-[72px] items-center justify-center rounded-md bg-primary px-3.5 text-primary-foreground text-[13px] font-semibold tracking-wide transition-all duration-200 hover:brightness-95 active:scale-95 shadow-xs"
                            >
                                {buttonText}
                                {hasCustomizations && totalItemQuantity > 0 && (
                                    <div className="absolute -top-1.5 -right-1.5 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-black text-[9px] text-white font-semibold border border-white dark:border-zinc-900 shadow-2xs">
                                        {totalItemQuantity}
                                    </div>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {hasCustomizations && (
                    <span className="text-[9px] text-gray-400 font-medium text-right mt-1 tracking-tight lowercase">
                        customisable
                    </span>
                )}
            </article>

            <VariantDrawer
                isOpen={isVariantDrawerOpen}
                setIsOpen={setIsVariantDrawerOpen}
                item={itemData}
            />
        </>
    );
}

export { ItemCardV1 };
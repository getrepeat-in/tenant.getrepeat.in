"use client";
import { useState } from "react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useDispatch, useSelector } from "react-redux";
import { ItemImage } from "@/components/global/item-image";
import DiaterySymbol from "@/components/global/diatery-symbol";
import VariantDrawer from "@/components/global/variant-drawer";
import { addItem, updateQuantity } from "@/store/slices/cartSlice";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

/**
 * Formats details string: description, allergens, calories, serving size
 */
const getDetailText = (item) => {
    const parts = [];
    if (item?.description || item?.desc) {
        parts.push(item?.description || item?.desc);
    }
    if (
        item?.allergens &&
        (Array.isArray(item.allergens)
            ? item.allergens.length > 0
            : Boolean(item.allergens))
    ) {
        parts.push(
            `Allergen ${Array.isArray(item.allergens)
                ? item.allergens.join(",")
                : item.allergens
            }`
        );
    }
    if (item?.calories || item?.nutritionalInfo?.calories) {
        parts.push(`${item?.calories || item?.nutritionalInfo?.calories}Kcal`);
    }
    if (
        item?.servingSize ||
        item?.nutritionalInfo?.servingSize ||
        item?.weight
    ) {
        parts.push(
            `${item?.servingSize ||
            item?.nutritionalInfo?.servingSize ||
            item?.weight
            }`
        );
    }
    return parts.length > 0
        ? parts.join(" | ")
        : "Freshly prepared with authentic ingredients.";
};

export const BestsellerItemCard = ({ item, promo, className }) => {
    const dispatch = useDispatch();
    const { restaurant } = useRestaurant();
    const cartItems = useSelector((state) => state.cart.items);

    const hasCustomizations =
        (item?.variants && item.variants.length > 0) ||
        (item?.addonGroups && item.addonGroups.length > 0);
    const [isVariantDrawerOpen, setIsVariantDrawerOpen] = useState(false);

    const basePrice =
        item?.price || item?.base_price || item?.defaultPrice || 0;
    let finalPrice = basePrice;

    // Apply promo discount if present
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
        item?.discounted_price !== undefined &&
        item?.discounted_price < basePrice
    ) {
        finalPrice = item.discounted_price;
    }

    const hasDiscount = finalPrice < basePrice;

    const totalItemQuantity = cartItems
        .filter((i) => i.item?._id === item?._id)
        .reduce((sum, current) => sum + current.quantity, 0);

    const simpleCartItem = cartItems.find(
        (i) =>
            i.cartItemId === item?._id ||
            (i.item?._id === item?._id &&
                (!i.selectedCustomizations ||
                    Object.keys(i.selectedCustomizations).length === 0))
    );
    const simpleQuantity = simpleCartItem?.quantity || 0;

    const handleAdd = (e) => {
        if (e) e.stopPropagation();
        if (hasCustomizations) {
            setIsVariantDrawerOpen(true);
        } else {
            dispatch(
                addItem({
                    item,
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
                updateQuantity({ itemId: item?._id, quantity: newQuantity })
            );
        }
    };

    return (
        <>
            <article
                onClick={() => setIsVariantDrawerOpen(true)}
                className={cn(
                    "flex flex-col w-[210px] sm:w-[230px] shrink-0 group select-none snap-start bg-white dark:bg-zinc-900 rounded-md p-2.5 border border-gray-100 dark:border-zinc-800 shadow-xs transition-shadow hover:shadow-sm cursor-pointer",
                    className
                )}
            >
                {/* Image Container with rounded-md */}
                <div className="relative aspect-[4/3] w-full rounded-md overflow-hidden bg-gray-100 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-800">
                    <ItemImage
                        src={item?.image}
                        alt={item?.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Dietary Symbol + Bestseller Badge */}
                <div className="flex items-center gap-2 mt-2.5">
                    <DiaterySymbol
                        type={item?.dietaryType || item?.dietary_type}
                        size={15}
                    />
                    <span className="bg-[#e21b70] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] tracking-wide">
                        Bestseller
                    </span>
                </div>

                {/* Item Name */}
                <h4
                    title={item?.name}
                    className="text-[14px] sm:text-[15px] font-bold text-gray-900 dark:text-zinc-100 truncate tracking-tight mt-1 leading-snug"
                >
                    {item?.name}
                </h4>

                {/* Price & Add Button Row */}
                <div className="flex items-center justify-between mt-2.5 pt-0.5 gap-2">
                    <div className="flex items-baseline gap-1.5 shrink-0">
                        {hasDiscount ? (
                            <>
                                <span className="text-[15px] sm:text-[16px] font-bold text-gray-900 dark:text-zinc-100">
                                    ₹{finalPrice.toFixed(2).replace(/\.00$/, "")}
                                </span>
                                <span className="text-[12px] text-gray-400 line-through">
                                    ₹{basePrice}
                                </span>
                            </>
                        ) : (
                            <span className="text-[15px] sm:text-[16px] font-bold text-gray-900 dark:text-zinc-100">
                                ₹{basePrice}
                            </span>
                        )}
                    </div>

                    {/* Add Button / Counter with rounded-xl */}
                    <div className="shrink-0 flex items-center">
                        {!hasCustomizations && simpleQuantity > 0 ? (
                            <div className="flex h-[32px] w-[82px] items-center justify-between rounded-xl bg-primary text-primary-foreground font-semibold overflow-hidden shadow-xs">
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
                                className="relative flex h-[32px] min-w-[72px] items-center justify-center rounded-xl bg-primary px-3.5 text-primary-foreground text-[13px] font-semibold tracking-wide transition-all duration-200 hover:brightness-95 active:scale-95 shadow-xs"
                            >
                                Add
                                {hasCustomizations && totalItemQuantity > 0 && (
                                    <div className="absolute -top-1.5 -right-1.5 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-black text-[9px] text-white font-semibold border border-white dark:border-zinc-900 shadow-2xs">
                                        {totalItemQuantity}
                                    </div>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </article>

            <VariantDrawer
                isOpen={isVariantDrawerOpen}
                setIsOpen={setIsVariantDrawerOpen}
                item={item}
            />
        </>
    );
};

export const BestsellerSection = ({
    items = [],
    promo,
    title = "Bestsellers",
    className,
}) => {
    if (!items || items.length === 0) return null;

    return (
        <section className={cn("w-full py-3", className)}>
            {title && (
                <div className="flex items-center justify-between mb-3 px-4 md:px-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
                        {title}
                    </h3>
                </div>
            )}

            <div className="flex gap-3.5 overflow-x-auto px-4 md:px-6 pb-3 pt-0.5 no-scrollbar scroll-smooth snap-x snap-mandatory">
                {items.map((item, idx) => (
                    <BestsellerItemCard
                        key={item?._id || item?.id || idx}
                        item={item}
                        promo={promo}
                    />
                ))}
            </div>
        </section>
    );
};

export default BestsellerItemCard;

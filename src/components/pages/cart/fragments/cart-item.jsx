"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { CookingInstructions } from "./cooking-instructions";
import { ItemImage } from "@/components/global/common/item-image";
import DiaterySymbol from "@/components/global/common/diatery-symbol";
import { Plus, Minus, Trash2, MessageSquarePlus, X } from "lucide-react";
import { updateQuantity, removeItem, updateInstructions } from "@/store/slices/cartSlice";

export function CartItem({ cartItem }) {
    const dispatch = useDispatch();
    const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
    const { item, quantity, price, selectedCustomizations = {}, cartItemId } = cartItem;

    const handleUpdate = (newQuantity) => {
        if (newQuantity <= 0) {
            dispatch(removeItem(cartItemId || item?._id));
        } else {
            dispatch(
                updateQuantity({
                    itemId: item?._id,
                    cartItemId,
                    quantity: newQuantity,
                })
            );
        }
    };

    const handleRemove = () => {
        dispatch(removeItem(cartItemId || item?._id));
    };

    const hasCustomizations = Object.keys(selectedCustomizations || {}).length > 0;
    const customizationEntries = Object.entries(selectedCustomizations || {}).map(
        ([groupName, selection]) => {
            const formattedVal = Array.isArray(selection)
                ? selection.join(", ")
                : String(selection);
            return {
                group: groupName,
                value: formattedVal,
            };
        }
    ).filter((c) => Boolean(c.value));

    const unitPrice = price || item?.base_price || item?.price || 0;
    const totalPrice = unitPrice * quantity;
    const description = item?.description;
    const dietaryType = item?.dietaryType || item?.dietary_type;

    return (
        <div className="flex flex-col gap-2.5 rounded-xl bg-white dark:bg-zinc-900 p-3 sm:p-3.5 border border-gray-150/80 dark:border-zinc-800 shadow-2xs transition-all duration-200">
            <div className="flex gap-3 items-start">
                <div className="relative size-18 sm:size-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-zinc-800 border border-gray-150/70 dark:border-zinc-750 shadow-2xs">
                    <ItemImage
                        src={item?.image}
                        alt={item?.name}
                        variant="thumbnail"
                        className="h-full w-full object-cover"
                    />
                    {dietaryType && (
                        <div className="absolute bottom-1 right-1 flex items-center justify-center p-0.5 rounded bg-white/95 dark:bg-zinc-900/95 shadow-2xs backdrop-blur-xs">
                            <DiaterySymbol type={dietaryType} size={12} />
                        </div>
                    )}
                </div>

                <div className="flex flex-1 flex-col min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3
                            title={item?.name}
                            className="text-sm sm:text-[15px] font-medium text-neutral-800 dark:text-zinc-100 truncate leading-snug flex-1"
                        >
                            {item?.name}
                        </h3>

                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-1 -mr-1 -mt-1 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0 cursor-pointer"
                            title="Remove Item"
                            aria-label="Remove item"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>

                    {description && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-0.5 leading-relaxed font-normal">
                            {description}
                        </p>
                    )}

                    {hasCustomizations && customizationEntries.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {customizationEntries.map((cust, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-normal bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 border border-gray-150 dark:border-zinc-700"
                                >
                                    <span className="text-neutral-400 mr-1">{cust.group}:</span>
                                    {cust.value}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-800/80">
                <div className="flex items-baseline gap-1.5">
                    <span className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-zinc-100">
                        ₹{totalPrice}
                    </span>
                    {quantity > 1 && (
                        <span className="text-xs text-neutral-400 dark:text-neutral-500 font-normal">
                            (₹{unitPrice} each)
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all active:scale-95 cursor-pointer ${cartItem.instructions
                            ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400'
                            : 'bg-neutral-50 border-gray-200 text-neutral-600 hover:bg-neutral-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-neutral-300 dark:hover:bg-zinc-700'
                            }`}
                        aria-label={isInstructionsOpen ? "Close note" : "Add note"}
                    >
                        {isInstructionsOpen ? (
                            <>
                                <X size={13} strokeWidth={2.5} />
                                Close
                            </>
                        ) : (
                            <>
                                <MessageSquarePlus size={13} strokeWidth={2.5} />
                            </>
                        )}
                    </button>

                    <div className="flex h-8 items-center rounded-lg border border-primary/30 bg-primary/5 dark:bg-primary/10 text-primary shadow-2xs">
                        <button
                            type="button"
                            onClick={() => handleUpdate(quantity - 1)}
                            className="flex h-full w-7.5 items-center justify-center rounded-l-lg hover:bg-primary/15 active:scale-95 transition-all cursor-pointer"
                            aria-label="Decrease quantity"
                        >
                            {quantity === 1 ? (
                                <Trash2 size={13} className="text-rose-500" />
                            ) : (
                                <Minus size={13} strokeWidth={2} />
                            )}
                        </button>
                        <span className="w-6 text-center text-xs font-semibold select-none">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            onClick={() => handleUpdate(quantity + 1)}
                            className="flex h-full w-7.5 items-center justify-center rounded-r-lg hover:bg-primary/15 active:scale-95 transition-all cursor-pointer"
                            aria-label="Increase quantity"
                        >
                            <Plus size={13} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>

            {isInstructionsOpen && (
                <div className="mt-2">
                    <CookingInstructions
                        instructions={cartItem.instructions || ""}
                        setInstructions={(val) => {
                            dispatch(updateInstructions({ cartItemId, itemId: item?._id, instructions: val }));
                        }}
                        isItemVariant={true}
                        hideHeader={true}
                    />
                </div>
            )}

            {!isInstructionsOpen && cartItem.instructions && (
                <div className="mt-2.5 -mx-3 -mb-3 bg-amber-50 dark:bg-amber-950/30 p-2.5 px-3 border-t border-amber-100 dark:border-amber-900/50 rounded-b-xl flex gap-2 text-amber-700 dark:text-amber-500 text-xs">
                    <MessageSquarePlus size={14} className="shrink-0 mt-0.5 opacity-80" />
                    <span className="leading-snug italic font-medium">{cartItem.instructions}</span>
                </div>
            )}
        </div>
    );
}

export default CartItem;

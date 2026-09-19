"use client";
import { useState, useEffect, useMemo } from "react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "@/store/slices/cartSlice";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { ItemImage } from "@/components/global/item-image";
import DiaterySymbol from "@/components/global/diatery-symbol";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VariantDrawer({ isOpen, setIsOpen, item }) {
    const dispatch = useDispatch();
    const { restaurant } = useRestaurant();
    const cartItems = useSelector((state) => state.cart.items);
    const globalAddonGroups = useSelector(
        (state) => state.menu?.addonGroups || []
    );
    const [selectedCustomizations, setSelectedCustomizations] = useState({});

    const itemAddonGroups = useMemo(() => {
        if (!item?.addonGroups?.length) return [];
        return globalAddonGroups.filter((g) =>
            item.addonGroups.includes(g._id || g)
        );
    }, [item, globalAddonGroups]);

    useEffect(() => {
        if (item) {
            const initial = {};
            if (item.variants?.length > 0) {
                item.variants.forEach((v) => {
                    const vKey = v.name || v.property_name;
                    if (v.options && v.options.length > 0) {
                        const defaultOpt = v.options.find(o => o.isDefault) || v.options[0];
                        initial[vKey] = defaultOpt.name;
                    }
                });
            }
            itemAddonGroups.forEach((group) => {
                if (
                    group.selectionType === "single" &&
                    group.items?.length > 0
                ) {
                    initial[group.name] = [group.items[0].item.name];
                } else {
                    initial[group.name] = [];
                }
            });
            setSelectedCustomizations(initial);
        }
    }, [item, itemAddonGroups]);

    const currentPrice = useMemo(() => {
        if (!item) return 0;
        let total = item.price || item.base_price || item.defaultPrice || 0;

        if (item.variants?.length > 0) {
            total = 0;
            item.variants.forEach((variant) => {
                const vKey = variant.name || variant.property_name;
                const selectedOptionName = selectedCustomizations[vKey];
                const option = variant.options?.find(
                    (o) => o.name === selectedOptionName
                );
                if (option) {
                    total += option.price;
                }
            });
            if (total === 0 && (item.price || item.base_price))
                total = item.price || item.base_price;
        }

        itemAddonGroups.forEach((group) => {
            const selectedNames = selectedCustomizations[group.name] || [];
            group.items?.forEach((addon) => {
                if (selectedNames.includes(addon.item.name)) {
                    const price =
                        addon.priceOverride !== null
                            ? addon.priceOverride
                            : addon.item.base_price || 0;
                    total += price;
                }
            });
        });

        return total;
    }, [item, selectedCustomizations, itemAddonGroups]);

    const [localQuantity, setLocalQuantity] = useState(1);

    useEffect(() => {
        if (isOpen) {
            setLocalQuantity(1);
        }
    }, [isOpen]);

    const handleAdd = () => {
        dispatch(
            addItem({
                item,
                restaurantId: restaurant?._id || restaurant?.id,
                selectedCustomizations,
                price: currentPrice,
                quantity: localQuantity,
            })
        );
        setIsOpen(false);
    };

    const toggleAddon = (groupName, optionName, selectionType) => {
        setSelectedCustomizations((prev) => {
            const currentSelected = prev[groupName] || [];
            if (selectionType === "single") {
                return { ...prev, [groupName]: [optionName] };
            } else {
                if (currentSelected.includes(optionName)) {
                    return {
                        ...prev,
                        [groupName]: currentSelected.filter(
                            (n) => n !== optionName
                        ),
                    };
                } else {
                    return {
                        ...prev,
                        [groupName]: [...currentSelected, optionName],
                    };
                }
            }
        });
    };

    if (!item) return null;

    const dietaryType = item.dietaryType || item.dietary_type;
    const hasVariants = item.variants && item.variants.length > 0;
    const hasAddons = itemAddonGroups && itemAddonGroups.length > 0;
    const descriptionText =
        item.description ||
        item.desc ||
        item.short_description ||
        item.item_description ||
        item.details ||
        "Freshly prepared with quality ingredients, made to order.";

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent
                side="bottom"
                showCloseButton={false}
                className="rounded-t-[28px] sm:rounded-t-[32px] p-0 bg-white dark:bg-zinc-950 max-h-[90vh] overflow-hidden flex flex-col max-w-lg mx-auto border-t border-neutral-100 dark:border-zinc-800 shadow-2xl"
            >
                <div className="flex-1 overflow-y-auto pb-4 no-scrollbar">
                    <div className="w-12 h-1.5 bg-neutral-200 dark:bg-zinc-800 rounded-full mx-auto my-2.5 shrink-0" />
                    <div className="px-4 sm:px-5">
                        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-100 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-xs border border-neutral-100 dark:border-zinc-800">
                            <ItemImage
                                src={item.image}
                                alt={item.name}
                                variant="detail"
                                className="h-full w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 active:scale-90 shadow-md"
                            >
                                <X size={16} strokeWidth={2.5} />
                                <span className="sr-only">Close</span>
                            </button>
                        </div>
                    </div>

                    <div className="px-5 pt-4 pb-2">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                {dietaryType && (
                                    <div className="shrink-0 flex items-center justify-center mt-1.5">
                                        <DiaterySymbol
                                            type={dietaryType}
                                            size={16}
                                        />
                                    </div>
                                )}
                                <SheetTitle className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight leading-snug">
                                    {item.name}
                                </SheetTitle>
                            </div>
                            <SheetDescription className="text-xl font-bold text-neutral-900 dark:text-neutral-100 shrink-0 mt-0.5">
                                ₹{currentPrice}
                            </SheetDescription>
                        </div>

                        {descriptionText && (
                            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                                {descriptionText}
                            </p>
                        )}
                    </div>

                    {/* Options & Addons Section (if available) */}
                    {(hasVariants || hasAddons) && (
                        <div className="px-5 py-4 flex flex-col gap-6 border-t border-neutral-100 dark:border-zinc-850 mt-3">
                            {/* Variants */}
                            {item.variants?.map((variant, idx) => {
                                const vKey = variant.name || variant.property_name || `variant-${idx}`;
                                return (
                                    <div
                                        key={variant._id || vKey}
                                        className="flex flex-col gap-2.5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[14px] sm:text-[15px] font-bold text-neutral-900 dark:text-neutral-100 tracking-tight capitalize">
                                                Choose {vKey}
                                            </h4>
                                            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                                                Required
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {variant.options?.map((option) => {
                                                const isSelected =
                                                    selectedCustomizations[
                                                    vKey
                                                    ] === option.name;

                                                return (
                                                    <label
                                                        key={option._id || option.name}
                                                        onClick={() =>
                                                            setSelectedCustomizations(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [vKey]:
                                                                        option.name,
                                                                })
                                                            )
                                                        }
                                                        className={`flex items-center justify-between cursor-pointer rounded-xl p-3.5 border transition-all duration-200 select-none ${isSelected
                                                            ? "border-primary bg-primary/5 shadow-2xs dark:bg-primary/10"
                                                            : "border-neutral-200/80 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-900/50 hover:bg-neutral-100/50 dark:hover:bg-zinc-850"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${isSelected
                                                                    ? "border-primary bg-primary"
                                                                    : "border-neutral-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                                                                    }`}
                                                            >
                                                                {isSelected && (
                                                                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                                                                )}
                                                            </div>
                                                            <span
                                                                className={`text-sm tracking-tight ${isSelected
                                                                    ? "text-neutral-900 dark:text-neutral-100 font-medium"
                                                                    : "text-neutral-700 dark:text-neutral-300 font-normal"
                                                                    }`}
                                                            >
                                                                {option.name}
                                                            </span>
                                                        </div>
                                                        <span
                                                            className={`text-sm font-medium tracking-tight ${isSelected
                                                                ? "text-neutral-900 dark:text-neutral-100"
                                                                : "text-neutral-500 dark:text-neutral-400"
                                                                }`}
                                                        >
                                                            ₹{option.price}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Addon Groups */}
                            {itemAddonGroups.map((group) => (
                                <div
                                    key={group._id}
                                    className="flex flex-col gap-2.5"
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[14px] sm:text-[15px] font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight capitalize">
                                            {group.name}
                                        </h4>
                                        <span className="text-[11px] font-normal text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                                            {group.selectionType === "single"
                                                ? "Select 1"
                                                : "Optional"}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {group.items?.map((addon) => {
                                            const optionName = addon.item.name;
                                            const optionPrice =
                                                addon.priceOverride !== null
                                                    ? addon.priceOverride
                                                    : addon.item.base_price || 0;
                                            const isSelected = (
                                                selectedCustomizations[
                                                group.name
                                                ] || []
                                            ).includes(optionName);

                                            return (
                                                <label
                                                    key={addon._id}
                                                    onClick={() =>
                                                        toggleAddon(
                                                            group.name,
                                                            optionName,
                                                            group.selectionType
                                                        )
                                                    }
                                                    className={`flex items-center justify-between cursor-pointer rounded-xl p-3.5 border transition-all duration-200 select-none ${isSelected
                                                        ? "border-primary bg-primary/5 shadow-2xs dark:bg-primary/10"
                                                        : "border-neutral-200/80 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-900/50 hover:bg-neutral-100/50 dark:hover:bg-zinc-850"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {group.selectionType ===
                                                            "single" ? (
                                                            <div
                                                                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${isSelected
                                                                    ? "border-primary bg-primary"
                                                                    : "border-neutral-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                                                                    }`}
                                                            >
                                                                {isSelected && (
                                                                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${isSelected
                                                                    ? "border-primary bg-primary text-primary-foreground"
                                                                    : "border-neutral-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                                                                    }`}
                                                            >
                                                                {isSelected && (
                                                                    <Check
                                                                        size={13}
                                                                        strokeWidth={3}
                                                                        className="text-primary-foreground"
                                                                    />
                                                                )}
                                                            </div>
                                                        )}
                                                        <span
                                                            className={`text-sm tracking-tight ${isSelected
                                                                ? "text-neutral-900 dark:text-neutral-100 font-medium"
                                                                : "text-neutral-700 dark:text-neutral-300 font-normal"
                                                                }`}
                                                        >
                                                            {optionName}
                                                        </span>
                                                    </div>
                                                    <span
                                                        className={`text-sm font-medium tracking-tight ${isSelected
                                                            ? "text-neutral-900 dark:text-neutral-100"
                                                            : "text-neutral-500 dark:text-neutral-400"
                                                            }`}
                                                    >
                                                        +₹{optionPrice}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sticky Elevated Bottom Action Bar */}
                <div className="sticky bottom-0 left-0 right-0 z-30 p-4 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-neutral-100 dark:border-zinc-800 flex items-center gap-3 shadow-lg">
                    {/* Quantity Stepper */}
                    <div className="flex h-12 w-28 items-center justify-between rounded-xl bg-neutral-100 dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-700 px-1">
                        <button
                            type="button"
                            onClick={() =>
                                setLocalQuantity(Math.max(1, localQuantity - 1))
                            }
                            className="flex h-10 w-8 items-center justify-center text-lg font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-zinc-800 rounded-lg transition-all active:scale-95 select-none"
                        >
                            -
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-neutral-900 dark:text-neutral-100 select-none">
                            {localQuantity}
                        </span>
                        <button
                            type="button"
                            onClick={() => setLocalQuantity(localQuantity + 1)}
                            className="flex h-10 w-8 items-center justify-center text-lg font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-zinc-800 rounded-lg transition-all active:scale-95 select-none"
                        >
                            +
                        </button>
                    </div>

                    {/* Add Item Button */}
                    <Button
                        onClick={handleAdd}
                        className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-[15px] shadow-sm hover:brightness-95 active:scale-[0.98] transition-all"
                    >
                        <span>Add</span>
                        <span className="opacity-60">|</span>
                        <span>₹{currentPrice * localQuantity}</span>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}




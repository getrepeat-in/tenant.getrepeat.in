"use client";
import { getImageUrl } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useDispatch, useSelector } from "react-redux";
import { addItem, updateQuantity } from "@/store/slices/cartSlice";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export default function VariantDrawer({ isOpen, setIsOpen, item }) {
    const dispatch = useDispatch();
    const { restaurant } = useRestaurant();
    const cartItems = useSelector(state => state.cart.items);
    const globalAddonGroups = useSelector(state => state.menu?.addonGroups || []);
    const [selectedCustomizations, setSelectedCustomizations] = useState({});

    const itemAddonGroups = useMemo(() => {
        if (!item?.addonGroups?.length) return [];
        return globalAddonGroups.filter(g => item.addonGroups.includes(g._id || g));
    }, [item, globalAddonGroups]);

    useEffect(() => {
        if (item) {
            const initial = {};
            if (item.variants?.length > 0) {
                item.variants.forEach(v => {
                    if (v.options && v.options.length > 0) {
                        initial[v.property_name] = v.options[0].name;
                    }
                });
            }
            itemAddonGroups.forEach(group => {
                if (group.selectionType === "single" && group.items?.length > 0) {
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
            item.variants.forEach(variant => {
                const selectedOptionName = selectedCustomizations[variant.property_name];
                const option = variant.options?.find(o => o.name === selectedOptionName);
                if (option) {
                    total += option.price;
                }
            });
            if (total === 0 && (item.price || item.base_price)) total = item.price || item.base_price;
        }

        itemAddonGroups.forEach(group => {
            const selectedNames = selectedCustomizations[group.name] || [];
            group.items?.forEach(addon => {
                if (selectedNames.includes(addon.item.name)) {
                    const price = addon.priceOverride !== null ? addon.priceOverride : (addon.item.base_price || 0);
                    total += price;
                }
            });
        });

        return total;
    }, [item, selectedCustomizations, itemAddonGroups]);

    const cartItemId = useMemo(() => {
        if (!item) return null;
        const custKey = Object.keys(selectedCustomizations).length > 0 ? `|${JSON.stringify(selectedCustomizations)}` : "";
        return `${item._id}${custKey}`;
    }, [item, selectedCustomizations]);

    const existingCartItem = useMemo(() => {
        return cartItems.find(i => i.cartItemId === cartItemId);
    }, [cartItems, cartItemId]);

    const quantity = existingCartItem?.quantity || 0;

    const [localQuantity, setLocalQuantity] = useState(1);

    useEffect(() => {
        if (isOpen) {
            setLocalQuantity(1);
        }
    }, [isOpen]);

    const handleAdd = () => {
        dispatch(addItem({
            item,
            restaurantId: restaurant?._id || restaurant?.id,
            selectedCustomizations,
            price: currentPrice,
            quantity: localQuantity
        }));
        setIsOpen(false);
    };

    const handleUpdate = (newQuantity) => {
        dispatch(updateQuantity({ itemId: item._id, cartItemId, quantity: newQuantity }));
    };

    const toggleAddon = (groupName, optionName, selectionType) => {
        setSelectedCustomizations(prev => {
            const currentSelected = prev[groupName] || [];
            if (selectionType === "single") {
                return { ...prev, [groupName]: [optionName] };
            } else {
                if (currentSelected.includes(optionName)) {
                    return { ...prev, [groupName]: currentSelected.filter(n => n !== optionName) };
                } else {
                    return { ...prev, [groupName]: [...currentSelected, optionName] };
                }
            }
        });
    };

    if (!item) return null;

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="bottom" className="rounded-t-2xl px-4 pb-6 pt-5 bg-white max-h-[85vh] overflow-y-auto">
                <SheetHeader className="text-left px-0 pb-3 border-b border-gray-100 flex-row gap-4 items-start">
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-gray-100 shrink-0 shadow-sm border border-gray-200/50">
                        {item.image ? (
                            <img
                                src={getImageUrl(item.image, true, "thumbnail")}
                                alt={item.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center font-bold text-gray-400">
                                {item.name?.charAt(0) || "I"}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col flex-1">
                        <SheetTitle className="text-lg font-bold leading-tight tracking-tight text-gray-900 line-clamp-2">
                            {item.name}
                        </SheetTitle>
                        <SheetDescription className="text-sm font-medium text-orange-600 mt-1">
                            ₹{currentPrice}
                        </SheetDescription>
                    </div>
                </SheetHeader>

                <div className="mt-4 flex flex-col gap-5 pb-[80px]">
                    {/* Variants */}
                    {item.variants?.map((variant) => (
                        <div key={variant.property_name} className="flex flex-col gap-3">
                            <h4 className="text-[13px] font-bold text-gray-900 tracking-wider uppercase bg-gray-100 px-3 py-1.5 rounded-lg w-fit">
                                {variant.property_name}
                            </h4>
                            <div className="flex flex-col gap-0">
                                {variant.options?.map((option) => (
                                    <label
                                        key={option.name}
                                        onClick={() => setSelectedCustomizations(prev => ({ ...prev, [variant.property_name]: option.name }))}
                                        className={`flex items-center justify-between cursor-pointer rounded-xl p-3.5 mb-2 border-2 transition-all duration-200 ${selectedCustomizations[variant.property_name] === option.name ? 'border-orange-500 bg-orange-50/50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${selectedCustomizations[variant.property_name] === option.name ? 'border-orange-600' : 'border-gray-300'}`}>
                                                {selectedCustomizations[variant.property_name] === option.name && (
                                                    <div className="h-2.5 w-2.5 rounded-full bg-orange-600" />
                                                )}
                                            </div>
                                            <span className={`text-[15px] tracking-tight ${selectedCustomizations[variant.property_name] === option.name ? 'text-gray-900 font-bold' : 'text-gray-600 font-medium'}`}>
                                                {option.name}
                                            </span>
                                        </div>
                                        <span className={`text-[15px] font-semibold tracking-tight ${selectedCustomizations[variant.property_name] === option.name ? 'text-orange-600' : 'text-gray-500'}`}>
                                            ₹{option.price}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    {itemAddonGroups.map((group) => (
                        <div key={group._id} className="flex flex-col gap-3">
                            <h4 className="text-[13px] font-bold text-gray-900 tracking-wider uppercase bg-gray-100 px-3 py-1.5 rounded-lg w-fit">
                                {group.name} {group.selectionType === "multiple" && <span className="text-gray-500 font-normal lowercase tracking-normal ml-1">(multiple)</span>}
                            </h4>
                            <div className="flex flex-col gap-0">
                                {group.items?.map((addon) => {
                                    const optionName = addon.item.name;
                                    const optionPrice = addon.priceOverride !== null ? addon.priceOverride : (addon.item.base_price || 0);
                                    const isSelected = (selectedCustomizations[group.name] || []).includes(optionName);

                                    return (
                                        <label
                                            key={addon._id}
                                            onClick={() => toggleAddon(group.name, optionName, group.selectionType)}
                                            className={`flex items-center justify-between cursor-pointer rounded-xl p-3.5 mb-2 border-2 transition-all duration-200 ${isSelected ? 'border-orange-500 bg-orange-50/50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                        >
                                            <div className="flex items-center gap-3.5">
                                                {group.selectionType === "single" ? (
                                                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${isSelected ? 'border-orange-600' : 'border-gray-300'}`}>
                                                        {isSelected && (
                                                            <div className="h-2.5 w-2.5 rounded-full bg-orange-600" />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className={`flex h-5 w-5 items-center justify-center rounded-[6px] border-2 transition-colors ${isSelected ? 'border-orange-600 bg-orange-600' : 'border-gray-300 bg-white'}`}>
                                                        {isSelected && (
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white">
                                                                <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}
                                                <span className={`text-[15px] tracking-tight ${isSelected ? 'text-gray-900 font-bold' : 'text-gray-600 font-medium'}`}>
                                                    {optionName}
                                                </span>
                                            </div>
                                            <span className={`text-[15px] font-semibold tracking-tight ${isSelected ? 'text-orange-600' : 'text-gray-500'}`}>
                                                +₹{optionPrice}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] flex items-center gap-3">
                    <div className="flex h-[46px] w-[130px] items-center justify-between rounded-[12px] border-[1.5px] border-[#e23744]/30 bg-[#fef2f2] px-1 text-[18px] font-bold text-[#e23744]">
                        <button onClick={() => setLocalQuantity(Math.max(1, localQuantity - 1))} className="flex h-full w-10 items-center justify-center hover:opacity-80 active:scale-95 focus:outline-none">-</button>
                        <span className="w-6 text-center">{localQuantity}</span>
                        <button onClick={() => setLocalQuantity(localQuantity + 1)} className="flex h-full w-10 items-center justify-center hover:opacity-80 active:scale-95 focus:outline-none">+</button>
                    </div>

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="flex h-[46px] flex-1 items-center justify-center gap-2 rounded-[12px] bg-[#e23744] text-[16px] font-bold tracking-wide text-white shadow-md transition-all duration-200 hover:bg-[#c9303d] active:scale-[0.98] focus:outline-none"
                    >
                        <span>Add item</span>
                        <span>₹{currentPrice * localQuantity}</span>
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

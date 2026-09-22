import { addItem } from "@/store/slices/cartSlice";
import { useState, useEffect, useMemo } from "react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useDispatch, useSelector } from "react-redux";

export function useVariantDrawer({ isOpen, setIsOpen, item }) {
    const dispatch = useDispatch();
    const { restaurant } = useRestaurant();
    const globalAddonGroups = useSelector((state) => state.menu?.addonGroups || []);

    const [selectedCustomizations, setSelectedCustomizations] = useState({});
    const [localQuantity, setLocalQuantity] = useState(1);

    const itemAddonGroups = useMemo(() => {
        if (!item?.addonGroups?.length) return [];
        return globalAddonGroups.filter((g) => {
            const gId = String(g._id || g);
            return item.addonGroups.some(ag => String(ag._id || ag) === gId);
        });
    }, [item, globalAddonGroups]);

    useEffect(() => {
        if (item) {
            const initial = {};
            if (item.variants?.length > 0) {
                item.variants.forEach((v, index) => {
                    const vKey = v.name || v.property_name || `variant-${index}`;
                    if (v.options && v.options.length > 0) {
                        const defaultOpt = v.options.find(o => o.isDefault) || v.options[0];
                        initial[vKey] = defaultOpt.name;
                    }
                });
            }
            itemAddonGroups.forEach((group, index) => {
                const groupName = group.name || group.title || `Add-on Group ${index + 1}`;
                initial[groupName] = [];
            });
            setSelectedCustomizations(initial);
        }
    }, [item, itemAddonGroups]);

    const currentPrice = useMemo(() => {
        if (!item) return 0;
        let total = item.price || item.base_price || item.defaultPrice || 0;

        if (item.variants?.length > 0) {
            total = 0;
            item.variants.forEach((variant, index) => {
                const vKey = variant.name || variant.property_name || `variant-${index}`;
                const selectedOptionName = selectedCustomizations[vKey];
                const option = variant.options?.find((o) => o.name === selectedOptionName);
                if (option) {
                    total += option.price;
                }
            });
            if (total === 0 && (item.price || item.base_price))
                total = item.price || item.base_price;
        }

        itemAddonGroups.forEach((group, index) => {
            const groupName = group.name || group.title || `Add-on Group ${index + 1}`;
            const selectedNames = selectedCustomizations[groupName] || [];
            group.items?.forEach((addon) => {
                if (selectedNames.includes(addon.name)) {
                    total += addon.price || 0;
                }
            });
        });

        return total;
    }, [item, selectedCustomizations, itemAddonGroups]);

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

    const toggleAddon = (groupName, optionName, selectionType, maxSelection = null) => {
        setSelectedCustomizations((prev) => {
            const currentSelected = prev[groupName] || [];
            if (selectionType === "single") {
                return { ...prev, [groupName]: [optionName] };
            } else {
                if (currentSelected.includes(optionName)) {
                    return { ...prev, [groupName]: currentSelected.filter((n) => n !== optionName) };
                } else {
                    if (maxSelection !== null && currentSelected.length >= maxSelection) {
                        return prev;
                    }
                    return { ...prev, [groupName]: [...currentSelected, optionName] };
                }
            }
        });
    };

    const handleVariantSelect = (vKey, optionName) => {
        setSelectedCustomizations((prev) => ({
            ...prev,
            [vKey]: optionName,
        }));
    };

    return {
        selectedCustomizations,
        itemAddonGroups,
        currentPrice,
        localQuantity,
        setLocalQuantity,
        handleAdd,
        toggleAddon,
        handleVariantSelect
    };
}

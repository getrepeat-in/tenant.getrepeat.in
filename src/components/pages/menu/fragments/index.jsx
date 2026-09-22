"use client";
import React, { useState, useEffect, useRef, useMemo, useDeferredValue } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRestaurant } from "@/hooks/useRestaurant";
import { MenuService } from "@/services/frontend/menu";
import { PromotionService } from "@/services/frontend/promotion";
import { setAddonGroups } from "@/store/slices/menuSlice";
import { MenuEmptyState } from "./menu-empty-state";
import { MenuSkeleton } from "@/components/skeleton";
import ItemCardV1 from "./item-cards";
import { ItemImage } from "@/components/global/common/item-image";
import { cn } from "@/lib/utils";

const CategoryTabItem = React.memo(({ category, fallbackImage, isActive, onClick }) => {
    const categoryImage = useMemo(() => {
        if (category?.image) return category.image;
        if (category?.icon) return category.icon;
        if (category?.cover_image) return category.cover_image;
        if (category?.banner) return category.banner;
        return fallbackImage || null;
    }, [category, fallbackImage]);

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "group shrink-0 flex items-center gap-2 rounded-full pl-1.5 pr-3.5 py-1 text-xs sm:text-sm font-bold transition-all duration-200 select-none cursor-pointer border",
                isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-xs scale-102 font-bold"
                    : "bg-neutral-100/90 dark:bg-zinc-850 hover:bg-neutral-200/80 text-neutral-700 dark:text-neutral-300 border-transparent font-semibold"
            )}
        >
            <div className="relative h-6 w-6 sm:h-7 sm:w-7 rounded-full overflow-hidden bg-neutral-100 dark:bg-zinc-850 shrink-0 border border-black/10 dark:border-white/10 shadow-2xs">
                <ItemImage
                    src={categoryImage}
                    alt={category?.name}
                    variant="thumbnail"
                    className="h-full w-full object-cover"
                />
            </div>
            <span className="truncate max-w-[130px] sm:max-w-[150px]">
                {category?.name}
            </span>
        </button>
    );
});
CategoryTabItem.displayName = "CategoryTabItem";

const CategorySection = React.memo(({ category, subCategories = [] }) => {
    const items = useMemo(() => {
        if (!subCategories || subCategories.length === 0) return [];
        return subCategories.flatMap((sub) => sub.items || []);
    }, [subCategories]);

    if (!items || items.length === 0) return null;

    return (
        <section
            id={`category-${category?._id || category?.id}`}
            className="scroll-mt-28 border-b border-gray-100 dark:border-zinc-800 last:border-b-0"
        >
            {/* Category Header */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 sm:py-3 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-900/50">
                <h3
                    title={category?.name}
                    className="text-[18px] sm:text-[20px] font-extrabold text-gray-900 dark:text-zinc-100 tracking-tight truncate min-w-0"
                >
                    {category?.name}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200/80 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 shrink-0">
                    {items.length}
                </span>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-zinc-900">
                {items.map((item) => (
                    <ItemCardV1
                        key={item?._id || item?.id}
                        item={item}
                    />
                ))}
            </div>
        </section>
    );
});
CategorySection.displayName = "CategorySection";

const MenuLayout = ({ searchVal = "", isVeg = false, onResetFilters }) => {
    const dispatch = useDispatch();
    const { slug } = useRestaurant();
    const searchParams = useSearchParams();
    const urlCategory = searchParams.get("category") || "";
    const [activeCategoryId, setActiveCategoryId] = useState("");
    const tabsRef = useRef(null);

    // React 18/19 deferred value for instant, lag-free keystroke responsiveness
    const deferredSearchVal = useDeferredValue(searchVal);

    // Fetch complete menu in one API call
    const {
        data: menuData = {},
        isPending: isMenuPending,
        isError: isMenuError,
    } = useQuery({
        queryKey: ["menu", slug],
        queryFn: async () => {
            const response = await MenuService.getMenu(slug);
            return response?.data || response || {};
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 5,
    });

    const { data: promotions = [] } = useQuery({
        queryKey: ["promotions", slug],
        queryFn: async () => {
            const response = await PromotionService.getAll(slug);
            return response?.data || response || [];
        },
        enabled: !!slug,
    });

    // Populate Redux addon groups whenever menu data loads
    useEffect(() => {
        if (menuData?.addonGroups && Array.isArray(menuData.addonGroups) && menuData.addonGroups.length > 0) {
            dispatch(setAddonGroups(menuData.addonGroups));
        }
    }, [menuData, dispatch]);

    // Parse categories from menuData (supports data.category, data.categories, or direct array)
    const rawCategories = useMemo(() => {
        if (Array.isArray(menuData)) {
            return menuData;
        }
        if (menuData?.category && Array.isArray(menuData.category)) {
            return menuData.category;
        }
        if (menuData?.categories && Array.isArray(menuData.categories)) {
            return menuData.categories;
        }
        return [];
    }, [menuData]);

    // Pre-indexed Menu: Computes dietary flags, promotional pricing, and search corpus once per data load
    const indexedMenu = useMemo(() => {
        if (!rawCategories || rawCategories.length === 0) return [];

        return rawCategories.map((cat) => {
            let subCats = [];
            if (Array.isArray(cat?.sub_category) && cat.sub_category.length > 0) {
                subCats = cat.sub_category;
            } else if (Array.isArray(cat?.items) && cat.items.length > 0) {
                subCats = [{ _id: cat._id, name: null, items: cat.items }];
            }

            const indexedSubCats = subCats.map((subCat) => {
                const rawItems = subCat?.items || [];
                const promoItems = PromotionService.applyPromotionsToItems(rawItems, promotions);

                const itemsWithCorpus = promoItems.map((item) => {
                    const dietary = (
                        item?.dietaryType ||
                        item?.dietary_type ||
                        item?.food_type ||
                        ""
                    ).toLowerCase();

                    const isVegItem =
                        dietary === "veg" ||
                        dietary === "vegetarian" ||
                        item?.food_type?.toUpperCase() === "VEG" ||
                        item?.is_veg === true ||
                        item?.isVeg === true;

                    const tagsStr = Array.isArray(item?.tags) ? item.tags.join(" ") : "";
                    const categoryName = cat?.name || "";
                    const subCategoryName = subCat?.name || "";
                    const itemName = item?.name || "";
                    const itemDesc = item?.description || "";

                    const searchCorpus = `${itemName} ${itemDesc} ${tagsStr} ${categoryName} ${subCategoryName}`.toLowerCase();

                    return {
                        ...item,
                        _isVeg: isVegItem,
                        _searchCorpus: searchCorpus,
                    };
                });

                return {
                    ...subCat,
                    items: itemsWithCorpus,
                };
            });

            const firstAvailableItem = indexedSubCats
                .flatMap((s) => s.items)
                .find((it) => it?.image);

            return {
                ...cat,
                sub_category: indexedSubCats,
                fallbackImage: cat.image || firstAvailableItem?.image || null,
            };
        });
    }, [rawCategories, promotions]);

    // High-performance tokenized filtering over the pre-indexed data
    const filteredCategories = useMemo(() => {
        const trimmed = (deferredSearchVal || "").trim().toLowerCase();
        const queryTokens = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];

        return indexedMenu
            .map((cat) => {
                const filteredSubCats = cat.sub_category
                    .map((subCat) => {
                        const matchingItems = subCat.items.filter((item) => {
                            // Filter by Veg
                            if (isVeg && !item._isVeg) return false;

                            // Filter by Tokenized Multi-word Search
                            if (queryTokens.length > 0) {
                                const matchesAllTokens = queryTokens.every((token) =>
                                    item._searchCorpus.includes(token)
                                );
                                if (!matchesAllTokens) return false;
                            }

                            return true;
                        });

                        return {
                            ...subCat,
                            items: matchingItems,
                        };
                    })
                    .filter((subCat) => subCat.items.length > 0);

                const totalItems = filteredSubCats.reduce((sum, s) => sum + s.items.length, 0);

                return {
                    ...cat,
                    sub_category: filteredSubCats,
                    totalItems,
                };
            })
            .filter((cat) => cat.totalItems > 0);
    }, [indexedMenu, deferredSearchVal, isVeg]);

    // Total matching item count across all categories
    const totalMatchingItems = useMemo(() => {
        return filteredCategories.reduce((sum, cat) => sum + (cat.totalItems || 0), 0);
    }, [filteredCategories]);

    // Auto-scroll to selected category if present in URL
    useEffect(() => {
        if (urlCategory) {
            setActiveCategoryId(urlCategory);
            const scrollToElement = () => {
                const el = document.getElementById(`category-${urlCategory}`);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    return true;
                }
                return false;
            };

            if (!scrollToElement()) {
                const timer = setTimeout(scrollToElement, 300);
                return () => clearTimeout(timer);
            }
        } else if (filteredCategories.length > 0 && !activeCategoryId) {
            setActiveCategoryId(filteredCategories[0]._id || filteredCategories[0].id);
        }
    }, [urlCategory, filteredCategories, activeCategoryId]);

    const handleCategoryClick = (categoryId) => {
        setActiveCategoryId(categoryId);
        const el = document.getElementById(`category-${categoryId}`);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    if (isMenuError) {
        return (
            <div className="py-16 text-center text-sm font-semibold text-red-500">
                Failed to load menu. Please try again.
            </div>
        );
    }

    if (isMenuPending) {
        return <MenuSkeleton />;
    }

    if (rawCategories.length === 0) {
        return <MenuEmptyState />;
    }

    if (filteredCategories.length === 0) {
        return (
            <MenuEmptyState
                title={searchVal ? `No Results for "${searchVal}"` : "No Items Found"}
                description={
                    searchVal
                        ? `We couldn't find any dishes matching "${searchVal}". Check for spelling or click below to view the entire menu.`
                        : "No dishes match your selected filter. Click below to view all items."
                }
                onReset={onResetFilters}
                showHome={false}
                searchVal={searchVal}
            />
        );
    }

    const isSearching = Boolean(searchVal.trim() || isVeg);

    return (
        <div className="w-full">
            {/* Sticky Category Tabs Bar */}
            {filteredCategories.length > 0 && (
                <div className="sticky top-[57px] sm:top-[65px] z-20 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 shadow-2xs">
                    <div
                        ref={tabsRef}
                        className="mx-auto max-w-screen-md flex items-center gap-2 overflow-x-auto px-4 py-2.5 no-scrollbar scroll-smooth"
                    >
                        {filteredCategories.map((cat) => {
                            const catId = cat?._id || cat?.id;
                            const isActive = activeCategoryId === catId;

                            return (
                                <CategoryTabItem
                                    key={catId}
                                    category={cat}
                                    fallbackImage={cat.fallbackImage}
                                    isActive={isActive}
                                    onClick={() => handleCategoryClick(catId)}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Main Menu Container */}
            <div className="mx-auto max-w-screen-md mt-4">
                {/* Search result summary when searching */}
                {isSearching && (
                    <div className="px-4 py-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                        Found {totalMatchingItems} item{totalMatchingItems !== 1 ? "s" : ""}
                        {searchVal ? ` for "${searchVal}"` : ""}
                        {isVeg ? " (Veg only)" : ""}
                    </div>
                )}

                {/* Categories & Subcategories Sections */}
                <div className="bg-white dark:bg-zinc-900 sm:rounded-2xl sm:border sm:border-gray-100 dark:sm:border-zinc-800 overflow-hidden shadow-xs">
                    {filteredCategories.map((category) => (
                        <CategorySection
                            key={category?._id || category?.id}
                            category={category}
                            subCategories={category.sub_category}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MenuLayout;
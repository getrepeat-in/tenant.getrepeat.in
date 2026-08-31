"use client";
import { ItemCard } from "./item-card";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useRestaurant } from "@/hooks/useRestaurant";
import { MenuService } from "@/services/frontend/menu";
import { setAddonGroups } from "@/store/slices/menuSlice";
import { PromotionService } from "@/services/frontend/promotion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const CategorySection = ({ category, slug, promotions = [] }) => {
    const dispatch = useDispatch();
    const { data: itemsGrouped = {}, isPending, isError } = useQuery({
        queryKey: ["items", slug, category?._id || category?.id],
        queryFn: async () => {
            const response = await MenuService.item.getByCategory(slug, category?._id || category?.id);
            const data = response?.data || response || {};
            if (data.addonGroups?.length > 0) {
                dispatch(setAddonGroups(data.addonGroups));
            }
            const items = data.items || data;
            const processedItems = Array.isArray(items) ? PromotionService.applyPromotionsToItems(items, promotions) : items;

            if (Array.isArray(processedItems)) {
                return { [category?.name || "Items"]: processedItems };
            }

            const processedGrouped = {};
            for (const [key, value] of Object.entries(items)) {
                processedGrouped[key] = Array.isArray(value) ? PromotionService.applyPromotionsToItems(value, promotions) : value;
            }
            return processedGrouped;
        },
        enabled: !!(category?._id),
    });

    const hasItems = Object.keys(itemsGrouped).length > 0;
    if (isError || (!isPending && !hasItems)) return null;
    const firstCategory = Object.keys(itemsGrouped)[0];

    return (
        <section className="mb-12 px-4 sm:px-6">
            <div className="mb-6 flex items-center justify-between pb-2">
                <h3 className="text-[20px] font-black tracking-tight">
                    {category?.name}
                </h3>
            </div>

            {isPending ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[200px] w-full animate-pulse rounded-[12px] bg-gray-100"></div>
                    ))}
                </div>
            ) : (
                <Accordion
                    type="multiple"
                    defaultValue={firstCategory ? [firstCategory] : []}
                    className="flex flex-col gap-6"
                >
                    {Object.entries(itemsGrouped).map(([subCategoryName, items]) => {
                        const isValidName = subCategoryName && subCategoryName !== "undefined" && subCategoryName !== "null";
                        const title = isValidName ? subCategoryName : "All Items";

                        return (
                            <AccordionItem
                                key={subCategoryName}
                                value={subCategoryName}
                                className="border border-[#e5e7eb] bg-white rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden"
                            >
                                <AccordionTrigger className="px-5 py-4 hover:no-underline bg-white transition-none data-[state=open]:border-b data-[state=open]:border-[#e5e7eb]">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-[17px] font-semibold tracking-tight">
                                            {title}
                                        </h4>
                                        <span className="flex items-center justify-center h-6 px-2 rounded-full bg-gray-100 text-[12px] font-bold text-gray-500">
                                            {items?.length || 0}
                                        </span>
                                    </div>
                                </AccordionTrigger>

                                <AccordionContent className="px-5 pb-6 pt-6">
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                        {Array.isArray(items) && items.map((item) => (
                                            <ItemCard.V1 key={item?._id || item?.id} item={item} />
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            )}
        </section>
    );
};

const MenuLayoutV1 = () => {
    const { slug } = useRestaurant();
    const { data: categories = [], isPending, isError } = useQuery({
        queryKey: ["categories", slug],
        queryFn: async () => {
            const response = await MenuService.category.getAll(slug);
            return response?.data || response || [];
        },
        enabled: !!slug,
    });

    const { data: promotions = [] } = useQuery({
        queryKey: ["promotions", slug],
        queryFn: async () => {
            const response = await PromotionService.getAll(slug);
            return response?.data || response || [];
        },
        enabled: !!slug,
    });

    if (isError) {
        return <div className="py-10 text-center text-sm text-red-500">Failed to load menu.</div>;
    }

    if (isPending) {
        return (
            <div className="flex w-full flex-col gap-12 py-6">
                {[1, 2].map((i) => (
                    <div key={i} className="px-4 sm:px-6">
                        <div className="mb-6 h-8 w-48 animate-pulse rounded-md bg-muted/60"></div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[1, 2, 3, 4].map((j) => (
                                <div key={j} className="h-[200px] w-full animate-pulse rounded-2xl bg-muted/60"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full py-6">
            {categories.map((category) => (
                <CategorySection key={category?._id || category?.id} slug={slug} category={category} promotions={promotions} />
            ))}
        </div>
    );
};

export default MenuLayoutV1;

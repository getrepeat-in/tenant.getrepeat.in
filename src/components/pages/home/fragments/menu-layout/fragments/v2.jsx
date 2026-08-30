"use client";
import { ItemCard } from "./item-card";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { MenuService } from "@/services/ui/menu";
import { useRestaurant } from "@/hooks/useRestaurant";
import { setAddonGroups } from "@/store/slices/menuSlice";

const CategorySectionV2 = ({ category, slug }) => {
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
            if (Array.isArray(items)) {
                return { [category?.name || "Items"]: items };
            }
            return items;
        },
        enabled: !!(category?._id || category?.id),
    });

    const hasItems = Object.keys(itemsGrouped).length > 0;
    if (isError || (!isPending && !hasItems)) return null;

    const allItems = Object.values(itemsGrouped).flat();

    return (
        <section
            id={`category-${category?._id || category?.id}`}
            className="mb-14 px-4 sm:px-6"
        >
            {isPending ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[200px] w-full animate-pulse rounded-[16px] bg-gray-100"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {allItems.map((item) => (
                        <ItemCard.V1 key={item?._id || item?.id} item={item} />
                    ))}
                </div>
            )}
        </section>
    );
};

const MenuLayoutV2 = () => {
    const { slug } = useRestaurant();
    const { data: categories = [], isPending, isError } = useQuery({
        queryKey: ["categories", slug],
        queryFn: async () => {
            const response = await MenuService.category.getAll(slug);
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
                        <div className="mb-6 h-10 w-48 animate-pulse rounded-md bg-muted/60"></div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[1, 2, 3, 4].map((j) => (
                                <div key={j} className="h-[200px] w-full animate-pulse rounded-[16px] bg-muted/60"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full py-8">
            {categories.map((category) => (
                <CategorySectionV2 key={category?._id || category?.id} slug={slug} category={category} />
            ))}
        </div>
    );
};

export default MenuLayoutV2;

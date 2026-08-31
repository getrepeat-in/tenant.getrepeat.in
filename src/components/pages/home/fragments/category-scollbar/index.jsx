"use client";
import { useRouter } from "next/navigation";
import { MenuService } from "@/services/frontend/menu";
import { useQuery } from "@tanstack/react-query";
import { useRestaurant } from "@/hooks/useRestaurant";
import { CategoryCard } from "./fragments/category-card";
import { CategoryScrollbarSkeleton } from "@/components/skeleton";

export const CategoryScrollbar = () => {
    const router = useRouter();
    const { slug } = useRestaurant();
    const { data: categories = [], isPending, isError, error } = useQuery({
        queryKey: ["categories", slug],
        queryFn: async () => {
            const response = await MenuService.category.getAll(slug);
            return response?.data || response || [];
        },
        enabled: !!slug,
        retry: false,
    });

    if (isPending) {
        return <CategoryScrollbarSkeleton />;
    }

    if (isError || !categories || categories.length === 0) {
        return null;
    }

    return (
        <section className="w-full pt-6">
            <div className="mb-5 flex items-center justify-between px-4 sm:px-6">
                <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    Explore Categories
                </h2>
            </div>

            <div className="flex gap-4 overflow-x-auto px-4 pb-3 sm:gap-5 sm:px-6 snap-x snap-mandatory hide-scrollbar">
                {categories.map((category) => (
                    <div
                        key={category?._id || category?.id}
                        className="shrink-0 snap-start cursor-pointer"
                        onClick={() => router.push(`/menu?category=${category?._id || category?.id}`)}
                    >
                        <CategoryCard.V2 category={category} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategoryScrollbar;
"use client";
import { useQuery } from "@tanstack/react-query";
import { PromotionService } from "@/services/frontend/promotion";
import { useRestaurant } from "@/hooks/useRestaurant";
import { BestsellerSection } from "@/components/pages/home/fragments/menu-layout/fragments/item-card/fragments/best-seller";

export const BestsellerDeals = () => {
    const { slug } = useRestaurant();

    const { data: promotions = [], isPending } = useQuery({
        queryKey: ["promotions", slug],
        queryFn: async () => {
            const response = await PromotionService.getAll(slug);
            return response?.data || response || [];
        },
        enabled: !!slug,
    });

    const activeDeals = promotions.filter(p => (!p.status || p.status === 'ACTIVE') && p.type === 'BESTSELLER');

    if (isPending || activeDeals.length === 0) return null;

    return (
        <div className="w-full mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeDeals.map((promo, idx) => (
                <BestsellerSection
                    key={promo._id || idx}
                    title={promo.title || "Bestsellers"}
                    items={promo.items || []}
                    promo={promo}
                />
            ))}
        </div>
    );
};

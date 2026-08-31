"use client";
import { useQuery } from "@tanstack/react-query";
import { useRestaurant } from "@/hooks/useRestaurant";
import { PromotionService } from "@/services/frontend/promotion";

export const PromotionOffers = () => {
    const { slug } = useRestaurant();

    const { data: promotions = [], isPending } = useQuery({
        queryKey: ["promotions", slug],
        queryFn: async () => {
            const response = await PromotionService.getAll(slug);
            return response?.data || response || [];
        },
        enabled: !!slug,
    });

    const activePromotions = promotions.filter(p => !p.status || p.status === 'ACTIVE');

    if (isPending || activePromotions.length === 0) return null;

    return (
        <div className="w-full mt-4 mb-2 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex gap-4 overflow-x-auto pb-6 px-4 md:px-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {activePromotions.map((promo, idx) => {
                    const isPercentage = promo.discount_type === 'PERCENTAGE' || promo.discount_type === 'PERCENTAGE_DISCOUNT';
                    const mainValue = isPercentage ? `${promo.discount_value}%` : `₹${promo.discount_value}`;

                    return (
                        <div
                            key={promo._id || idx}
                            className="relative flex w-[88vw] max-w-[340px] shrink-0 snap-center rounded-md bg-white overflow-hidden border border-gray-100 group hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all cursor-pointer"
                        >
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-r border-gray-200 z-10 shadow-[inset_-3px_0_4px_rgba(0,0,0,0.02)]"></div>
                            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-l border-gray-200 z-10 shadow-[inset_3px_0_4px_rgba(0,0,0,0.02)]"></div>
                            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 w-[30%] py-3 px-2 border-r-[2.5px] border-dashed border-gray-200 relative">
                                <span className="text-[24px] font-black text-primary leading-none tracking-tighter text-center group-hover:scale-105 transition-transform">
                                    {mainValue}
                                </span>
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest mt-1 opacity-80">
                                    OFF
                                </span>
                            </div>

                            <div className="flex flex-col justify-center w-[70%] p-3 pl-3.5 bg-white relative">
                                <h3 className="text-[13px] font-medium tracking-tight text-gray-900 leading-tight line-clamp-2 uppercase">
                                    {promo.name}
                                </h3>
                                <div className="mt-2 flex items-center justify-between gap-1">
                                    <p className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wide truncate">
                                        {promo.ends_at ? `Till ${new Date(promo.ends_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}` : 'Limited time'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

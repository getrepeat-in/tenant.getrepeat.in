import axios from "axios";
import { API_ENDPOINTS } from "@/services/api-endpoints";

export const PromotionService = {
    getAll: async (slug) => {
        const response = await axios.get(API_ENDPOINTS.MENU.PROMOTIONS(slug));
        const data = response.data;
        if (!data.success) {
            throw new Error(data.message || "Failed to load promotions.");
        }
        return data;
    },

    applyPromotionsToItems: (items, activePromotions = []) => {
        if (!activePromotions?.length || !items?.length) return items;

        const validPromotions = activePromotions.filter(p => !p.status || p.status === 'ACTIVE');
        if (!validPromotions.length) return items;

        const checkApplicability = (promo, item) => {
            if (promo.is_applicable_on_all_items) return true;
            
            const promoItems = promo.applicable_items || promo.items || [];
            const itemIdMatch = promoItems.some(id => id === item._id || id?._id === item._id);
            if (itemIdMatch) return true;
            
            const promoCategories = promo.applicable_categories || promo.categories || [];
            const categoryMatch = item.category && promoCategories.some(
                id => id === item.category || id === item.category?._id || id?._id === item.category?._id
            );
            return Boolean(categoryMatch);
        };

        const calculateDiscount = (promo, basePrice) => {
            const promoType = promo.discount_type || promo.type;
            
            switch (promoType) {
                case 'PERCENTAGE_DISCOUNT':
                case 'PERCENTAGE':
                    return (basePrice * promo.discount_value) / 100;
                case 'FLAT_DISCOUNT':
                case 'FLAT':
                case 'FIXED':
                    return promo.discount_value;
                default:
                    return 0;
            }
        };

        return items.map(item => {
            const basePrice = item.price || item.base_price || item.defaultPrice || 0;
            
            const applicablePromos = validPromotions
                .filter(promo => checkApplicability(promo, item))
                .map(promo => {
                    const discount = calculateDiscount(promo, basePrice);
                    return {
                        promo,
                        discount,
                        discountedPrice: Math.max(0, basePrice - discount)
                    };
                })
                .sort((a, b) => b.discount - a.discount);

            const bestDiscount = applicablePromos[0];

            if (bestDiscount && bestDiscount.discount > 0) {
                return {
                    ...item,
                    discounted_price: bestDiscount.discountedPrice,
                    applied_promotion: {
                        _id: bestDiscount.promo._id,
                        name: bestDiscount.promo.name,
                        type: bestDiscount.promo.discount_type || bestDiscount.promo.type,
                        discount_value: bestDiscount.promo.discount_value,
                    }
                };
            }

            return item;
        });
    }
};

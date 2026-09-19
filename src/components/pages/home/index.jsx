"use client";
import { useState } from "react";
import { Bell } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import CartBar from "./fragments/cart-bar";
import { useRouter } from "next/navigation";
import Footer from "@/components/global/footer"
import { useQuery } from "@tanstack/react-query";
import { MenuService } from "@/services/frontend/menu";
import { ResponsiveHeader } from "./fragments/header"
import { useRestaurant } from "@/hooks/useRestaurant";
import PromoCarousel from "./fragments/promo-carousel";
import { MenuEmptyState } from "./fragments/empty-state";
import { QuickActions } from "./fragments/quick-actions";
import { MenuLayout } from "./fragments/menu-layout/fragments"
import { RestaurantOfflineState } from "./fragments/offline-state";
import { useWebsiteConfiguration } from "@/hooks/useWebsiteConfiguration";
import { FreebieItems } from "./fragments/promo-carousel/fragments/freebie-items";
import { SpecialDeals } from "./fragments/promo-carousel/fragments/special-deals";
import { BestsellerDeals } from "./fragments/promo-carousel/fragments/bestseller-deals";

const Home = () => {
    const { user } = useUser();
    const { slug, restaurant, name: restaurantName, isLoading: isRestaurantLoading } = useRestaurant();
    const { configuration, isLoading: isConfigLoading } = useWebsiteConfiguration();
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");

    const { data: menuData, isPending: isMenuPending } = useQuery({
        queryKey: ["menu", slug],
        queryFn: async () => {
            const response = await MenuService.getMenu(slug);
            return response?.data || response || {};
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 5,
    });

    const categories = menuData?.category || menuData?.categories || (Array.isArray(menuData) ? menuData : []);
    const isEmptyMenu = !isMenuPending && categories.length === 0;
    const isOffline = restaurant?.openingHours?.currentlyOpen === false;

    if (isOffline) {
        return <RestaurantOfflineState restaurantName={restaurant?.name || restaurantName} />;
    }

    if (isEmptyMenu) {
        return <MenuEmptyState />;
    }

    const brandInfo = {
        greeting: (
            <>
                Hi, <span className="font-semibold">{user?.name || "Foodie!"}</span> 👋
            </>
        ),
        name: restaurant?.name || restaurantName || "Restaurant",
        tagline: restaurant?.tagline || "Fresh. Simple. Always Delicious.",
        logo: (
            <div className="relative size-10 rounded-md overflow-hidden border border-border/50 bg-muted shrink-0 shadow-sm">
                {restaurant?.logo ? (
                    <img
                        src={getImageUrl(restaurant.logo, true, "thumbnail")}
                        alt={restaurant?.name || "Logo"}
                        className="w-full h-full object-cover rounded-md bg-white"
                    />
                ) : (
                    <img
                        src="/assets/images/image-placeholder.webp"
                        alt={restaurant?.name || "Logo"}
                        className="w-full h-full object-cover rounded-md bg-white"
                    />
                )}
            </div>
        ),
    };

    return (
        <div className="w-full mx-auto min-h-screen bg-slate-50 pb-20">
            <ResponsiveHeader
                isLoading={isRestaurantLoading}
                brand={brandInfo}
                actions={[
                    {
                        id: "notifications",
                        icon: <Bell size={24} strokeWidth={2.5} />,
                        badge: 3,
                        ariaLabel: "Notifications",
                        onClick: () => {
                            console.log("Notifications");
                        },
                    },
                ]}
                searchPlaceholder="Search your favorite meal..."
                searchValue={searchValue}
                onSearchChange={(value) => {
                    setSearchValue(value);
                }}
                onSearchSubmit={(value) => {
                    if (value?.trim()) {
                        router.push(`/menu?q=${encodeURIComponent(value)}`);
                    } else {
                        router.push("/menu");
                    }
                }}
                onFilterClick={() => {
                    router.push(`/menu?is_veg=true`);
                }}
            />

            <PromoCarousel
                banners={configuration?.homepage?.banners}
                isLoading={isConfigLoading}
            />

            <FreebieItems />
            <BestsellerDeals />
            <SpecialDeals />

            <QuickActions />

            {/* <MenuLayout.V2 /> */}

            <CartBar />
        </div>
    )
}

export default Home
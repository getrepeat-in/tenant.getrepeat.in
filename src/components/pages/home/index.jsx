"use client";
import { useState } from "react";
import { Bell } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import CartBar from "./fragments/cart-bar";
import { useRouter } from "next/navigation";
import Footer from "@/components/global/footer"
import { useQuery } from "@tanstack/react-query";
import { MenuService } from "@/services/ui/menu";
import { AppSidebar } from "../../global/sidebar"
import { ResponsiveHeader } from "./fragments/header"
import { useRestaurant } from "@/hooks/useRestaurant";
import PromoCarousel from "./fragments/promo-carousel";
import { MenuEmptyState } from "./fragments/empty-state";
import CategoryScrollbar from "./fragments/category-scollbar"
import { MenuLayout } from "./fragments/menu-layout/fragments"
import { RestaurantOfflineState } from "./fragments/offline-state";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useWebsiteConfiguration } from "@/hooks/useWebsiteConfiguration";

const Home = () => {
    const { user } = useUser();
    const { slug, restaurant, name: restaurantName, isLoading: isRestaurantLoading } = useRestaurant();
    const { configuration, isLoading: isConfigLoading } = useWebsiteConfiguration();
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");

    const { data: categories = [], isPending: isCategoriesPending } = useQuery({
        queryKey: ["categories", slug],
        queryFn: async () => {
            const response = await MenuService.category.getAll(slug);
            return response?.data || response || [];
        },
        enabled: !!slug,
        retry: false,
    });

    const isEmptyMenu = !isCategoriesPending && categories.length === 0;
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
        <SidebarProvider>
            <div className="md:hidden">
                <AppSidebar brand={brandInfo} />
            </div>
            <SidebarInset>
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
                                router.push(`/search?q=${encodeURIComponent(value)}`);
                            }
                        }}
                        onFilterClick={() => {
                            router.push(`/search?is_veg=true`);
                        }}
                    />

                    <PromoCarousel
                        banners={configuration?.homepage?.banners}
                        isLoading={isConfigLoading}
                    />

                    <CategoryScrollbar />
                    <MenuLayout.V2 />
                    {/* <Footer /> */}
                    <CartBar />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Home
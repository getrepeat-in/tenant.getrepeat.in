"use client";
import { Bell } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import CartBar from "./fragments/cart-bar";
import { useHomePage } from "./helpers/useHomePage";
import { ResponsiveHeader } from "./fragments/header"
import PromoCarousel from "./fragments/promo-carousel";
import { MenuEmptyState } from "./fragments/empty-state";
import { RestaurantOfflineState } from "./fragments/offline-state";

import dynamic from "next/dynamic";
const FreebieItems = dynamic(() => import("./fragments/promo-carousel/fragments/freebie-items").then(mod => mod.FreebieItems), { ssr: false });
const SpecialDeals = dynamic(() => import("./fragments/promo-carousel/fragments/special-deals").then(mod => mod.SpecialDeals), { ssr: false });
const BestsellerDeals = dynamic(() => import("./fragments/promo-carousel/fragments/bestseller-deals").then(mod => mod.BestsellerDeals), { ssr: false });
const MenuLayout = dynamic(() => import("../menu/fragments"), { ssr: false });

const Home = () => {
    const {
        isRestaurantLoading,
        configuration,
        isConfigLoading,
        searchValue,
        setSearchValue,
        isEmptyMenu,
        isOffline,
        brandInfo,
        handleSearchSubmit,
        handleFilterClick,
        handleNotificationClick,
        restaurantName,
        restaurant
    } = useHomePage();

    if (isOffline) {
        return <RestaurantOfflineState restaurantName={restaurant?.name || restaurantName} />;
    }

    if (isEmptyMenu) {
        return <MenuEmptyState />;
    }

    const formattedBrandInfo = {
        greeting: (
            <>
                Hi, <span className="font-semibold">{brandInfo.greeting || "Foodie!"}</span> 👋
            </>
        ),
        name: brandInfo.name,
        tagline: brandInfo.tagline,
        logo: (
            <div className="relative size-10 rounded-md overflow-hidden border border-border/50 bg-muted shrink-0 shadow-sm">
                {brandInfo.logo ? (
                    <img
                        src={getImageUrl(brandInfo.logo, true, "thumbnail")}
                        alt={brandInfo.name}
                        className="w-full h-full object-cover rounded-md bg-white"
                    />
                ) : (
                    <img
                        src="/logo.png"
                        alt={brandInfo.name}
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
                brand={formattedBrandInfo}
                actions={[
                    {
                        id: "notifications",
                        icon: <Bell size={24} strokeWidth={2.5} />,
                        badge: 3,
                        ariaLabel: "Notifications",
                        onClick: handleNotificationClick,
                    },
                ]}
                searchPlaceholder="Search your favorite meal..."
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onSearchSubmit={handleSearchSubmit}
                onFilterClick={handleFilterClick}
            />

            <PromoCarousel
                banners={configuration?.homepage?.banners}
                isLoading={isConfigLoading}
            />

            <FreebieItems />
            <BestsellerDeals />
            <SpecialDeals />
            <MenuLayout searchVal={searchValue} />
            <CartBar />
        </div>
    )
}

export default Home
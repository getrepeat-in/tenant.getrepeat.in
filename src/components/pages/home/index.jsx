"use client";
import { Bell } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import CartBar from "./fragments/cart-bar";
import { useHomePage } from "./helpers/useHomePage";
import { ResponsiveHeader } from "./fragments/header"
import PromoCarousel from "./fragments/promo-carousel";
import { MenuEmptyState } from "./fragments/empty-state";
import { QuickActions } from "./fragments/quick-actions";
import { MenuHeroBanner } from "./fragments/menu-hero-banner";
import { RestaurantOfflineState } from "./fragments/offline-state";
import { FreebieItems } from "./fragments/promo-carousel/fragments/freebie-items";
import { SpecialDeals } from "./fragments/promo-carousel/fragments/special-deals";
import { BestsellerDeals } from "./fragments/promo-carousel/fragments/bestseller-deals";

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

            <MenuHeroBanner />

            <QuickActions />
            <CartBar />
        </div>
    )
}

export default Home
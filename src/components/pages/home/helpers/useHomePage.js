import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useRestaurant } from "@/hooks/useRestaurant";
import { MenuService } from "@/services/frontend/menu";
import { useWebsiteConfiguration } from "@/hooks/useWebsiteConfiguration";

export function useHomePage() {
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

    const brandInfo = {
        greeting: user?.name,
        name: restaurant?.name || restaurantName || "Restaurant",
        tagline: restaurant?.tagline || "Fresh. Simple. Always Delicious.",
        logo: restaurant?.logo
    };

    const handleSearchSubmit = (value) => {
        if (value?.trim()) {
            router.push(`/menu?q=${encodeURIComponent(value)}`);
        } else {
            router.push("/menu");
        }
    };

    const handleFilterClick = () => {
        router.push(`/menu?is_veg=true`);
    };

    const handleNotificationClick = () => {
        console.log("Notifications");
    };

    return {
        user,
        restaurant,
        restaurantName,
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
        handleNotificationClick
    };
}

import api from "@/lib/api/axiosInstance";
import { getTenantSlug } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function useRestaurant() {
    const slug = getTenantSlug();

    const { data: restaurant, isLoading, isError, error } = useQuery({
        queryKey: ["restaurant", slug],
        queryFn: async () => {
            const response = await api.get(`/api/${slug}`);
            return response.data?.data || response.data || {};
        },
        enabled: !!slug,
    });

    const name = restaurant?.name || slug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return {
        slug,
        name,
        restaurant,
        isLoading,
        isError,
        error
    };
}

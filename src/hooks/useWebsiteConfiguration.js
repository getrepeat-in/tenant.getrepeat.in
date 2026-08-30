import api from "@/lib/api/axiosInstance";
import { getTenantSlug } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function useWebsiteConfiguration() {
    const slug = getTenantSlug();

    const { data: configuration, isLoading, isError, error } = useQuery({
        queryKey: ["website-configuration", slug],
        queryFn: async () => {
            const response = await api.get(`/api/${slug}/website-configuration`);
            return response.data?.data || response.data || {};
        },
        enabled: !!slug,
    });

    return {
        slug,
        configuration,
        isLoading,
        isError,
        error
    };
}

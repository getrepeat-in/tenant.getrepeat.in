"use client";
import { useSelector, useDispatch } from "react-redux";
import { getTenantSlug } from "@/lib/utils";
import { fetchRestaurant } from "@/store/slices/restaurantSlice";

export function useRestaurant() {
    const dispatch = useDispatch();
    const fallbackSlug = getTenantSlug();
    const storedSlug = useSelector((state) => state.restaurant?.slug);
    const slug = storedSlug || fallbackSlug;
    
    const restaurant = useSelector((state) => state.restaurant?.restaurant);
    const loading = useSelector((state) => state.restaurant?.loading);
    const error = useSelector((state) => state.restaurant?.error);
    const isError = Boolean(error);

    const name = restaurant?.name || slug
        ?.split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    const refetch = () => {
        return dispatch(fetchRestaurant(slug));
    };

    return {
        slug,
        name,
        restaurant,
        isLoading: loading,
        loading,
        isError,
        error,
        refetch,
    };
}

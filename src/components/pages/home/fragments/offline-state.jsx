"use client";
import { EmptyState } from "@/components/ui/empty-state";

export const RestaurantOfflineState = ({ restaurantName }) => {
    return (
        <EmptyState
            className="h-[100dvh] bg-white dark:bg-zinc-950"
            image="https://i.pinimg.com/736x/30/76/2f/30762f0a8ba21cc146cefad0c15394dd.jpg"
            title="We'll be right back!"
            description={<>{restaurantName ? <strong className="font-semibold text-neutral-700 dark:text-neutral-300">{restaurantName}</strong> : "This restaurant"} is currently closed and not accepting orders. Please visit us again later.</>}
            badgeText="Currently Offline"
            badgeColor="red"
        />
    );
};

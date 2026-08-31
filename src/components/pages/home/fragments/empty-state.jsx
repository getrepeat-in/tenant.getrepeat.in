"use client";
import { ChefHat } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export const MenuEmptyState = () => {
    return (
        <EmptyState
            className="h-[100dvh] bg-white dark:bg-zinc-950"
            icon={ChefHat}
            title="Menu Coming Soon"
            description="This restaurant is carefully crafting its menu. Check back shortly to explore their delicious offerings."
            badgeText="Opening Soon"
            badgeColor="primary"
        />
    );
};

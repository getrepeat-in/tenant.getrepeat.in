"use client";
import React from "react";
import { ShoppingBag, Utensils } from "lucide-react";
import { EmptyState } from "@/components/global/common/empty-state";

export function EmptyCart() {
    return (
        <EmptyState 
            icon={ShoppingBag}
            badgeIcon={Utensils}
            badgeText="Hungry for something delicious?"
            title="Your cart is feeling empty"
            description="Explore our mouth-watering menu and add your favorite dishes to get started!"
            buttonText="Explore Menu"
        />
    );
}

export default EmptyCart;

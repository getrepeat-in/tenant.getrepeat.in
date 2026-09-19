"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MenuHeader } from "./fragments/menu-header";
import MenuLayout from "./fragments";
import CartBar from "@/components/pages/home/fragments/cart-bar";
import Footer from "@/components/global/footer";

const Menu = () => {
    const searchParams = useSearchParams();
    
    const initialQuery = searchParams.get("q") || "";
    const initialVeg = searchParams.get("is_veg") === "true";

    const [searchVal, setSearchVal] = useState(initialQuery);
    const [isVeg, setIsVeg] = useState(initialVeg);

    // Sync state only on initial mount or when external URL query changes (e.g. back/forward button)
    useEffect(() => {
        const q = searchParams.get("q") || "";
        const veg = searchParams.get("is_veg") === "true";
        setSearchVal((prev) => (prev !== q ? q : prev));
        setIsVeg((prev) => (prev !== veg ? veg : prev));
    }, [searchParams]);

    // Debounced URL update to avoid flooding history on every keystroke
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(window.location.search);
            if (searchVal.trim()) {
                params.set("q", searchVal.trim());
            } else {
                params.delete("q");
            }
            if (isVeg) {
                params.set("is_veg", "true");
            } else {
                params.delete("is_veg");
            }

            const newSearch = params.toString();
            const newUrl = newSearch ? `/menu?${newSearch}` : "/menu";
            window.history.replaceState(null, "", newUrl);
        }, 250);

        return () => clearTimeout(timer);
    }, [searchVal, isVeg]);

    const handleSearchChange = (val) => {
        setSearchVal(val);
    };

    const handleFilterToggle = () => {
        setIsVeg((prev) => !prev);
    };

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
    };

    const handleResetFilters = () => {
        setSearchVal("");
        setIsVeg(false);
        window.history.replaceState(null, "", "/menu");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
            <MenuHeader
                searchVal={searchVal}
                setSearchVal={handleSearchChange}
                isVeg={isVeg}
                handleFilterToggle={handleFilterToggle}
                handleSearchSubmit={handleSearchSubmit}
            />
            <MenuLayout
                searchVal={searchVal}
                isVeg={isVeg}
                onResetFilters={handleResetFilters}
            />
            <CartBar />
            <Footer />
        </div>
    );
};

export default Menu;
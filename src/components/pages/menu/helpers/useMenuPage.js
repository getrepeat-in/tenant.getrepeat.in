import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function useMenuPage() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";
    const initialVeg = searchParams.get("is_veg") === "true";

    const [searchVal, setSearchVal] = useState(initialQuery);
    const [isVeg, setIsVeg] = useState(initialVeg);

    useEffect(() => {
        const q = searchParams.get("q") || "";
        const veg = searchParams.get("is_veg") === "true";
        setSearchVal((prev) => (prev !== q ? q : prev));
        setIsVeg((prev) => (prev !== veg ? veg : prev));
    }, [searchParams]);

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

    return {
        searchVal,
        isVeg,
        handleSearchChange,
        handleFilterToggle,
        handleSearchSubmit,
        handleResetFilters
    };
}

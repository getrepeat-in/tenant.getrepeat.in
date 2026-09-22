"use client";
import MenuLayout from "./fragments";
import { useMenuPage } from "./helpers/useMenuPage";
import { MenuHeader } from "./fragments/menu-header";
import Footer from "@/components/global/common/footer";
import CartBar from "@/components/pages/home/fragments/cart-bar";

const Menu = () => {
    const {
        searchVal,
        isVeg,
        handleSearchChange,
        handleFilterToggle,
        handleSearchSubmit,
        handleResetFilters
    } = useMenuPage();

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
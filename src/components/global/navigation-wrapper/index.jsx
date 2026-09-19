"use client";
import { Breadcrumbs } from "../breadcrumb";
import { usePathname } from "next/navigation";
import BottomNav from "../sidebar/fragments/bottom-nav";
import { AppSidebar } from "../sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useRestaurant } from "@/hooks/useRestaurant";
import { getImageUrl } from "@/lib/utils";

export default function NavigationWrapper({ children }) {
    const pathname = usePathname();
    const { restaurant, name: restaurantName } = useRestaurant();

    const brandInfo = {
        name: restaurant?.name || restaurantName || "Restaurant",
        tagline: restaurant?.tagline || "Fresh. Simple. Always Delicious.",
        logo: restaurant?.logo ? (
            <div className="relative size-10 rounded-md overflow-hidden border border-border/50 bg-muted shrink-0 shadow-sm">
                <img
                    src={getImageUrl(restaurant.logo, true, "thumbnail")}
                    alt={restaurant?.name || "Logo"}
                    className="w-full h-full object-cover rounded-md bg-white"
                />
            </div>
        ) : null,
    };
    
    const hideBottomNavPaths = ["/login", "/register", "/cart"];
    const shouldHideBottomNav = hideBottomNavPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

    const hideBreadcrumbPaths = ["/", "/login", "/register", "/social"];
    const shouldHideBreadcrumbs = pathname === "/" || hideBreadcrumbPaths.some(path => path !== "/" && (pathname === path || pathname.startsWith(`${path}/`)));

    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar brand={brandInfo} />
            <SidebarInset className="flex-1 flex flex-col min-h-screen min-w-0 bg-slate-50">
                {!shouldHideBreadcrumbs && <Breadcrumbs />}
                <main className="flex-1">
                    {children}
                </main>
                {!shouldHideBottomNav && <BottomNav />}
            </SidebarInset>
        </SidebarProvider>
    );
}
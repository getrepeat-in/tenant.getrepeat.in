"use client";
import { getImageUrl } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useRestaurant } from "@/hooks/useRestaurant";
import BottomNav from "@/components/global/sidebar/fragments/bottom-nav";
import { AppSidebar } from "@/components/global/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/components/global/breadcrumbs";

export default function NavigationWrapper({ children }) {
    const pathname = usePathname();
    const { restaurant, name: restaurantName } = useRestaurant();

    const brandInfo = {
        name: restaurant?.name || restaurantName || "Restaurant",
        tagline: restaurant?.tagline || "Fresh. Simple. Always Delicious.",
        logo: (
            <div className="relative size-10 rounded-md overflow-hidden border border-border/50 bg-muted shrink-0 shadow-sm">
                <img
                    src={restaurant?.logo ? getImageUrl(restaurant.logo, true, "thumbnail") : "/logo.png"}
                    alt={restaurant?.name || "Logo"}
                    className="w-full h-full object-cover rounded-md bg-white"
                />
            </div>
        ),
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
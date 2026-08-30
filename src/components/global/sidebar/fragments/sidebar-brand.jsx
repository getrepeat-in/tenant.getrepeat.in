"use client";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function SidebarBrand({ brand, href = "/" }) {
    if (!brand) return null;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    render={<a href={href} />}
                    className="group relative flex h-auto w-full items-center gap-3 rounded-md border border-gray-200/80 bg-white px-3.5 py-3 shadow-sm transition-all duration-200 hover:bg-gray-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
                >
                    {brand.logo ? (
                        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-105">
                            {typeof brand.logo === "string" ? (
                                <img
                                    src={brand.logo}
                                    alt={brand.name || "Brand logo"}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                brand.logo
                            )}
                        </div>
                    ) : (
                        brand.name && (
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-sm font-bold text-orange-600 ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-105">
                                {brand.name.charAt(0).toUpperCase()}
                            </div>
                        )
                    )}
 
                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                        {brand.name && (
                            <span className="truncate text-[15px] font-bold tracking-tight text-sidebar-foreground leading-none">
                                {brand.name}
                            </span>
                        )}
                        {brand.tagline && (
                            <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50 leading-none">
                                {brand.tagline}
                            </span>
                        )}
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
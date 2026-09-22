"use client";
import { NavUser } from "./fragments/sidebar-user";
import { SidebarNav } from "./fragments/sidebar-nav";
import { SidebarBrand } from "./fragments/sidebar-brand";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

export function AppSidebar({ brand, ...props }) {
    return (
        <Sidebar {...props}>
            <SidebarHeader className="relative">
                <SidebarBrand brand={brand} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarNav />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

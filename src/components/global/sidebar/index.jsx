"use client";
import { X } from "lucide-react";
import { NavUser } from "./fragments/sidebar-user";
import { SidebarNav } from "./fragments/sidebar-nav";
import { SidebarBrand } from "./fragments/sidebar-brand";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, useSidebar } from "@/components/ui/sidebar";

export function AppSidebar({ brand, ...props }) {
    const { isMobile, setOpenMobile } = useSidebar();

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

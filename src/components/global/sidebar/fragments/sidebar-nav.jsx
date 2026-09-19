"use client";
import { cn } from "@/lib/utils";
import { SidebarService } from "../services/sidebar.service";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function SidebarNav({ activePath = "/" }) {
    const items = SidebarService.getNavItems();

    return (
        <SidebarGroup className="px-3">
            <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 mb-2">
                Menu
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1.5">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePath === item.href;

                    return (
                        <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                                render={<a href={item.href} />}
                                isActive={isActive}
                                tooltip={item.label}
                                className={cn(
                                    "relative flex h-auto items-center gap-3 rounded-[5px] px-3 py-2.5 text-[14px] font-medium transition-all duration-200 ease-in-out group",
                                    isActive
                                        ? "!bg-primary !text-primary-foreground shadow-md shadow-primary/20 font-bold border-0 hover:!bg-primary/90 hover:!text-primary-foreground"
                                        : "text-gray-600 hover:bg-white dark:text-gray-400 dark:hover:bg-zinc-800/80 hover:text-gray-950 dark:hover:text-white border border-transparent shadow-none hover:shadow-sm hover:shadow-black/[0.03]"
                                )}
                            >
                                <Icon className={cn("size-[18px] transition-transform duration-200 group-hover:scale-105")} strokeWidth={isActive ? 2.5 : 2} />
                                <span>{item.label}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

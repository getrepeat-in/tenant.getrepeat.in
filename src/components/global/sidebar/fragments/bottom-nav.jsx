"use client";
import { usePathname, useRouter } from "next/navigation";
import { SidebarService } from "../services/sidebar.service";

export default function BottomNav() {
    const router = useRouter();
    const pathname = usePathname();

    const TABS = SidebarService.bottomNavItems()
    const activeTab =
        TABS.find((tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`))
            ?.id ?? "home";

    const activeIndex = TABS.findIndex((tab) => tab.id === activeTab);

    function selectTab(tab) {
        router.push(tab.href);
    }

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center md:hidden">
            <nav
                aria-label="Primary"
                className="relative w-full border-t border-gray-150/60 bg-white/80 pb-safe pt-1 shadow-[0_-2px_12px_rgba(0,0,0,0.03)] backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/80"
            >
                <div
                    className="absolute top-0 h-[2px] bg-orange-500 transition-all duration-300 ease-out"
                    style={{
                        width: `${100 / TABS.length}%`,
                        left: `${(100 / TABS.length) * activeIndex}%`,
                    }}
                />

                <ul className="flex items-center justify-between px-2">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = tab.id === activeTab;

                        return (
                            <li key={tab.id} className="flex flex-1">
                                <button
                                    type="button"
                                    onClick={() => selectTab(tab)}
                                    aria-current={isActive ? "page" : undefined}
                                    className="group flex flex-1 flex-col items-center gap-0.5 py-2 transition-all duration-200 focus-visible:outline-none"
                                >
                                    <span
                                        className={`flex items-center justify-center transition-all duration-200 ${isActive
                                            ? "text-orange-500 scale-105"
                                            : "text-gray-400 group-hover:text-gray-600 dark:text-zinc-500"
                                            }`}
                                    >
                                        <Icon
                                            className="size-[20px]"
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                    </span>

                                    <span
                                        className={`text-[9px] font-bold tracking-tight transition-colors duration-200 uppercase ${isActive
                                            ? "text-orange-500"
                                            : "text-gray-400 dark:text-zinc-500"
                                            }`}
                                    >
                                        {tab.label}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}
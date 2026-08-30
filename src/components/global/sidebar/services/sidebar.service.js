import { Home, ShoppingBag, User, Settings, Heart, Clock, HomeIcon, UtensilsIcon, ShoppingCartIcon, HeadsetIcon, UserIcon } from "lucide-react";

export const SidebarService = {
    getNavItems: () => [
        {
            id: "home",
            label: "Home",
            icon: Home,
            href: "/",
        },
        {
            id: "orders",
            label: "My Orders",
            icon: ShoppingBag,
            href: "/orders",
        },
        {
            id: "favorites",
            label: "Favorites",
            icon: Heart,
            href: "/favorites",
        },
        {
            id: "history",
            label: "History",
            icon: Clock,
            href: "/history",
        },
        {
            id: "profile",
            label: "Profile",
            icon: User,
            href: "/profile",
        },
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
            href: "/settings",
        }
    ],

    bottomNavItems: () => [
        {
            id: "home",
            label: "Home",
            icon: HomeIcon,
            href: "/",
        },
        {
            id: "menu",
            label: "Menu",
            icon: UtensilsIcon,
            href: "/menu",
        },
        {
            id: "cart",
            label: "Cart",
            icon: ShoppingCartIcon,
            href: "/cart",
        },
        {
            id: "support",
            label: "Support",
            icon: HeadsetIcon,
            href: "/support",
        },
        {
            id: "profile",
            label: "Profile",
            icon: UserIcon,
            href: "/profile",
        },
    ]

};

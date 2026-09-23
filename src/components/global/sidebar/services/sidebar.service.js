import { Home, ShoppingBag, User, Settings, Heart, Clock, HomeIcon, UtensilsIcon, ShoppingCartIcon, HeadsetIcon, UserIcon, Camera } from "lucide-react";

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
            id: "profile",
            label: "Profile",
            icon: User,
            href: "/profile",
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
            id: "social",
            label: "Social",
            icon: Camera,
            href: "/social",
        },
        {
            id: "profile",
            label: "Profile",
            icon: UserIcon,
            href: "/profile",
        },
    ]

};

"use client";
import { usePathname } from "next/navigation";
import BottomNav from "../sidebar/fragments/bottom-nav";

export default function NavigationWrapper({ children }) {
    const pathname = usePathname();
    
    const hideNavPaths = ["/login", "/register", "/cart"];
    const shouldHide = hideNavPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

    return (
        <>
            {children}
            {!shouldHide && <BottomNav />}
        </>
    );
}

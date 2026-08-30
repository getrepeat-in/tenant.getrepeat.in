"use client";
import { useRestaurant } from "@/hooks/useRestaurant";

export function Footer() {
    const { name: restaurantName } = useRestaurant();

    return (
        <footer className="relative w-full pb-4 select-none overflow-hidden pointer-events-none flex flex-col items-center justify-center">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent mb-5" />
            <div className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                <span>Served with</span>
                <span className="text-rose-500 inline-block text-[11px] animate-pulse">❤</span>
                <span>by</span>
            </div>

            <div className="w-full text-center px-4 overflow-hidden">
                <h2 className="text-[10vw] sm:text-[8vw] font-black uppercase tracking-tighter sm:tracking-tight leading-none text-neutral-900/[0.2] transition-all">
                    {restaurantName}
                </h2>
            </div>
        </footer>
    );
}

export default Footer;

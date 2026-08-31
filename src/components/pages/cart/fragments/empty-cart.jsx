"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center animate-in fade-in duration-500">
            <div className="mb-6 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                <ShoppingBag size={54} strokeWidth={1.5} />
            </div>
            <h2 className="mb-3 text-[22px] font-extrabold tracking-tight text-gray-900">
                Your cart is empty
            </h2>
            <p className="mb-8 max-w-[280px] text-[15px] leading-relaxed text-gray-500 font-medium">
                Looks like you haven't added anything yet. Explore our menu to find your favorites!
            </p>
            <Link 
                href="/" 
                className="flex h-[52px] w-full max-w-[280px] items-center justify-center rounded-xl bg-primary px-6 text-[16px] font-bold tracking-wide text-primary-foreground shadow-md transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
            >
                Browse Menu
            </Link>
        </div>
    );
}

"use client";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-[90svh] flex-col items-center justify-center bg-background px-6 py-12 font-poppins text-slate-900">
            <div className="flex w-full max-w-md flex-col items-center text-center">
                <div className="relative mb-8 transition-transform duration-300 hover:scale-105">
                    <img
                        src="/assets/icons/general/404.png"
                        alt="404 - Page Not Found"
                        className="mx-auto w-full max-w-[280px] object-contain drop-shadow-[0_8px_24px_rgba(249,115,22,0.15)]"
                    />
                </div>

                <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                    <button
                        onClick={() => window.history.back()}
                        className="group flex flex-1 items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white p-3.5 text-[14px] font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-950 active:scale-[0.98]"
                    >
                        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                        Go Back
                    </button>

                    <Link
                        href="/"
                        className="group flex flex-1 items-center justify-center gap-2 rounded-[5px] bg-orange-500 p-3.5 text-[14px] font-semibold text-white shadow-md shadow-orange-500/10 transition-all hover:bg-orange-600 active:scale-[0.98]"
                    >
                        <Home className="size-4" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

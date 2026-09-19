"use client";
import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import MyOrdersPage from "@/components/pages/orders";

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[70vh] flex items-center justify-center">
                    <Loader2 size={28} className="animate-spin text-primary" />
                </div>
            }
        >
            <MyOrdersPage />
        </Suspense>
    );
}

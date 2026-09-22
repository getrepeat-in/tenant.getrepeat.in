"use client";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import OrderDetailsPage from "@/components/pages/order-details";

export default function OrderPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Loader2 size={28} className="animate-spin text-primary" />
                </div>
            }
        >
            <OrderDetailsPage />
        </Suspense>
    );
}

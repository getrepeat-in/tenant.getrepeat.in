"use client";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import MyOrdersPage from "@/components/pages/orders";
import ProtectedRoute from "@/components/global/protected-route";

export default function Page() {
    return (
        <ProtectedRoute>
            <Suspense
                fallback={
                    <div className="min-h-[70vh] flex items-center justify-center">
                        <Loader2 size={28} className="animate-spin text-primary" />
                    </div>
                }
            >
                <MyOrdersPage />
            </Suspense>
        </ProtectedRoute>
    );
}

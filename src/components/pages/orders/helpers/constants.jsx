import { CheckCircle2, XCircle, CheckCheck, BellRing, ReceiptText, ChefHat, Clock, Truck, ShoppingBag, Utensils, PackageCheck } from "lucide-react";

export const ORDER_STATUS_CONFIG = {
    PLACED: { label: "Placed", icon: ReceiptText, badgeClass: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800/50", indicatorClass: "bg-blue-500", isActive: true },
    ACCEPTED: { label: "Accepted", icon: CheckCheck, badgeClass: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-800/50", indicatorClass: "bg-amber-500", isActive: true },
    PREPARING: { label: "Preparing", icon: ChefHat, badgeClass: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-800/50", indicatorClass: "bg-purple-500", isActive: true },
    READY: { label: "Ready", icon: BellRing, badgeClass: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50", indicatorClass: "bg-emerald-500", isActive: true },
    SERVED: { label: "Served", icon: Utensils, badgeClass: "bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-300 border-teal-200 dark:border-teal-800/50", indicatorClass: "bg-teal-500", isActive: true },
    PICKED_UP: { label: "Picked Up", icon: ShoppingBag, badgeClass: "bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 border-violet-200 dark:border-violet-800/50", indicatorClass: "bg-violet-500", isActive: true },
    IN_TRANSIT: { label: "Out for Delivery", icon: Truck, badgeClass: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50", indicatorClass: "bg-indigo-500", isActive: true },
    DELIVERED: { label: "Delivered", icon: PackageCheck, badgeClass: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/50", indicatorClass: "bg-cyan-500", isActive: true },
    COMPLETED: { label: "Completed", icon: CheckCircle2, badgeClass: "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700", indicatorClass: "bg-zinc-400", isActive: false },
    CANCELLED: { label: "Cancelled", icon: XCircle, badgeClass: "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-800/50", indicatorClass: "bg-rose-500", isActive: false },
    REJECTED: { label: "Rejected", icon: XCircle, badgeClass: "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-800/50", indicatorClass: "bg-rose-500", isActive: false },
};

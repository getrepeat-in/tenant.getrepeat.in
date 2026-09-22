import { CheckCircle2, CircleAlert, Info, TriangleAlert } from "lucide-react";

export const NOTIFICATION_VARIANTS = {
    success: {
        icon: CheckCircle2,
        className: "border-emerald-200 bg-emerald-50 text-emerald-900",
        iconClass: "text-emerald-600",
        progress: "bg-emerald-500",
    },
    error: {
        icon: CircleAlert,
        className: "border-red-200 bg-red-50 text-red-900",
        iconClass: "text-red-600",
        progress: "bg-red-500",
    },
    warning: {
        icon: TriangleAlert,
        className: "border-yellow-200 bg-yellow-50 text-yellow-900",
        iconClass: "text-yellow-600",
        progress: "bg-yellow-500",
    },
    info: {
        icon: Info,
        className: "border-sky-200 bg-sky-50 text-sky-900",
        iconClass: "text-sky-600",
        progress: "bg-sky-500",
    },
};

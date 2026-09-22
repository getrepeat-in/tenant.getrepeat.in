import { CheckCircle2, ReceiptText, ChefHat, ShoppingBag, CheckCheck, BellRing, Truck, Utensils, PackageCheck } from "lucide-react";

export const TAKEAWAY_STEPS = [
    { key: "PLACED", label: "Placed", desc: "Order received", icon: ReceiptText },
    { key: "ACCEPTED", label: "Accepted", desc: "Confirmed", icon: CheckCheck },
    { key: "PREPARING", label: "Preparing", desc: "Cooking freshly", icon: ChefHat },
    { key: "READY", label: "Ready", desc: "Ready for pickup", icon: BellRing },
    { key: "PICKED_UP", label: "Picked Up", desc: "Collected by you", icon: ShoppingBag },
    { key: "COMPLETED", label: "Done", desc: "Order complete", icon: CheckCircle2 },
];

export const DELIVERY_STEPS = [
    { key: "PLACED", label: "Placed", desc: "Order received", icon: ReceiptText },
    { key: "ACCEPTED", label: "Accepted", desc: "Confirmed", icon: CheckCheck },
    { key: "PREPARING", label: "Preparing", desc: "Cooking freshly", icon: ChefHat },
    { key: "READY", label: "Ready", desc: "Packed for delivery", icon: BellRing },
    { key: "IN_TRANSIT", label: "On the Way", desc: "Out for delivery", icon: Truck },
    { key: "DELIVERED", label: "Delivered", desc: "Handed to you", icon: PackageCheck },
    { key: "COMPLETED", label: "Done", desc: "Order complete", icon: CheckCircle2 },
];

export const DINE_IN_STEPS = [
    { key: "PLACED", label: "Placed", desc: "Order received", icon: ReceiptText },
    { key: "ACCEPTED", label: "Accepted", desc: "Confirmed", icon: CheckCheck },
    { key: "PREPARING", label: "Preparing", desc: "Cooking freshly", icon: ChefHat },
    { key: "READY", label: "Ready", desc: "Ready at counter", icon: BellRing },
    { key: "SERVED", label: "Served", desc: "Served at table", icon: Utensils },
    { key: "COMPLETED", label: "Done", desc: "Order complete", icon: CheckCircle2 },
];

export function getStepsForType(orderType = "DINE_IN") {
    switch ((orderType || "").toUpperCase()) {
        case "TAKEAWAY": return TAKEAWAY_STEPS;
        case "DELIVERY": return DELIVERY_STEPS;
        default: return DINE_IN_STEPS;
    }
}

export function getStepIndex(steps, orderStatus) {
    const os = (orderStatus || "").toUpperCase();
    if (os === "CANCELLED" || os === "REJECTED") return -1;
    const idx = steps.findIndex((step) => step.key === os);
    return idx !== -1 ? idx : 0;
}
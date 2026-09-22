import { Home, Briefcase, Navigation, MapPin } from "lucide-react";

export const DEFAULT_LABELS = [
    { label: "Home", icon: Home },
    { label: "Work", icon: Briefcase },
    { label: "Other", icon: Navigation }
];

export const getIconForLabel = (label) => {
    const found = DEFAULT_LABELS.find(l => l.label.toLowerCase() === (label || "").toLowerCase());
    return found ? found.icon : MapPin;
};
import { cn } from "@/lib/utils";
import { getIconForLabel } from "./helpers/constants";
import { CheckCircle2, Edit2, Trash2, Loader2 } from "lucide-react";

export function AddressCard({ address, isSelected, isDeleting, onSelect, onEdit, onDelete, readOnly }) {
    const Icon = getIconForLabel(address.label);
    return (
        <div
            onClick={() => onSelect && onSelect(address)}
            className={cn(
                "relative p-3 rounded-lg border transition-all cursor-pointer group",
                isSelected
                    ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm shadow-primary/10"
                    : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-primary/50"
            )}
        >
            <div className="flex items-start gap-2.5">
                <div className={cn(
                    "p-1.5 rounded-lg shrink-0 transition-colors",
                    isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-400 group-hover:text-primary group-hover:bg-primary/10"
                )}>
                    <Icon size={16} strokeWidth={2} />
                </div>

                <div className="flex-1 min-w-0 pr-20">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-zinc-100 capitalize">
                            {address.label || "Address"}
                        </h4>
                        {address.isDefault && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wide">
                                Default
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-snug">
                        {address.street}, {address.city}, {address.state} {address.zipCode}
                    </p>
                    {address.instructions && (
                        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1.5 bg-neutral-50 dark:bg-zinc-800/50 px-2 py-1 rounded inline-block">
                            Note: {address.instructions}
                        </p>
                    )}
                </div>

                {isSelected && (
                    <div className="absolute top-3 right-3 text-primary animate-in zoom-in">
                        <CheckCircle2 size={20} className="fill-primary/20" />
                    </div>
                )}

                {!readOnly && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-0.5">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(address); }}
                            className="text-neutral-500 hover:text-primary transition-colors p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-zinc-800"
                            title="Edit Address"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(address._id); }}
                            disabled={isDeleting}
                            className="text-rose-500 hover:text-rose-600 transition-colors p-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            title="Delete Address"
                        >
                            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

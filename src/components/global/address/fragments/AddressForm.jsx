import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, Check, Loader2 } from "lucide-react";
import { DEFAULT_LABELS } from "./helpers/constants";

export function AddressForm({ isOpen, onClose, onSubmit, formData, setFormData, isEditing, isPending }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-950 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-full duration-300 pt-5 pb-6 px-4 sm:px-5">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-neutral-200 dark:bg-zinc-800 rounded-full" />

                <div className="flex items-center justify-between mb-6 mt-2">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-zinc-100 tracking-tight">
                        {isEditing ? "Edit Address" : "Add New Address"}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-neutral-700 dark:hover:text-zinc-200 transition-colors"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Save As</label>
                        <div className="flex flex-wrap gap-2">
                            {DEFAULT_LABELS.map((item) => (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, label: item.label })}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all border",
                                        formData.label === item.label
                                            ? "bg-primary/10 border-primary/30 text-primary"
                                            : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-neutral-600 dark:text-neutral-400 hover:border-gray-300 dark:hover:border-zinc-700"
                                    )}
                                >
                                    <item.icon size={14} />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Street Address *</label>
                        <input
                            required
                            type="text"
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                            placeholder="House/Flat No, Building, Street Area"
                            className="w-full h-11 px-3 rounded-md bg-neutral-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 text-sm text-neutral-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">City *</label>
                            <input
                                required
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder="e.g. Mumbai"
                                className="w-full h-11 px-3 rounded-md bg-neutral-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 text-sm text-neutral-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Zip Code *</label>
                            <input
                                required
                                type="text"
                                value={formData.zipCode}
                                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                placeholder="e.g. 400001"
                                className="w-full h-11 px-3 rounded-md bg-neutral-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 text-sm text-neutral-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">State</label>
                        <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            placeholder="e.g. Maharashtra"
                            className="w-full h-11 px-3 rounded-md bg-neutral-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 text-sm text-neutral-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Delivery Instructions (Optional)</label>
                        <textarea
                            value={formData.instructions}
                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                            placeholder="e.g. Ring the bell twice, leave at the door..."
                            rows={2}
                            className="w-full p-3 rounded-md bg-neutral-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 text-sm text-neutral-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-4 h-4 rounded border border-gray-300 dark:border-zinc-700 group-hover:border-primary transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                className="peer sr-only"
                            />
                            <div className="absolute inset-0 bg-primary scale-0 peer-checked:scale-100 transition-transform rounded-[3px] flex items-center justify-center">
                                <Check size={12} className="text-white" strokeWidth={3} />
                            </div>
                        </div>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400 select-none">Set as default address</span>
                    </label>

                    <div className="pt-3 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-11 rounded-md text-sm font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 h-11 rounded-md bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/25 hover:brightness-95 active:scale-[0.98] transition-all"
                        >
                            {isPending ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                isEditing ? "Save Changes" : "Save Address"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

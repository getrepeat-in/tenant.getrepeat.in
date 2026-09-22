import { Check } from "lucide-react";
import DiaterySymbol from "@/components/global/common/diatery-symbol";

export function AddonGroupSelector({ itemAddonGroups, selectedCustomizations, toggleAddon }) {
    if (!itemAddonGroups || itemAddonGroups.length === 0) return null;

    return (
        <>
            {itemAddonGroups.map((group, index) => {
                const groupName = group.name || group.title || `Add-on Group ${index + 1}`;
                return (
                <div
                    key={group._id}
                    className="flex flex-col gap-2.5"
                >
                    <div className="flex items-center justify-between gap-3">
                        <h4 className="text-[14px] sm:text-[15px] font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight capitalize line-clamp-1 flex-1">
                            {groupName}
                        </h4>
                        <span className="shrink-0 whitespace-nowrap text-[11px] font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full">
                            {group.minSelection > 0
                                ? (group.selectionType === "single" ? "Required (Select 1)" : `Required (Min ${group.minSelection})`)
                                : "Optional"}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2">
                        {group.items?.map((addon) => {
                            const optionName = addon.name;
                            const optionPrice = addon.price || 0;
                            const isSelected = (
                                selectedCustomizations[groupName] || []
                            ).includes(optionName);

                            return (
                                <label
                                    key={addon._id}
                                    onClick={() =>
                                        toggleAddon(
                                            groupName,
                                            optionName,
                                            group.selectionType,
                                            group.maxSelection
                                        )
                                    }
                                    className={`flex items-center justify-between cursor-pointer rounded-xl p-3.5 border transition-all duration-200 select-none ${
                                        isSelected
                                            ? "border-primary bg-primary/5 shadow-2xs dark:bg-primary/10"
                                            : "border-neutral-200/80 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-900/50 hover:bg-neutral-100/50 dark:hover:bg-zinc-850"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {group.selectionType === "single" ? (
                                            <div
                                                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                                                    isSelected
                                                        ? "border-primary bg-primary"
                                                        : "border-neutral-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                                                }`}
                                            >
                                                {isSelected && (
                                                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
                                                    isSelected
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-neutral-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                                                }`}
                                            >
                                                {isSelected && (
                                                    <Check
                                                        size={13}
                                                        strokeWidth={3}
                                                        className="text-primary-foreground"
                                                    />
                                                )}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            {addon.dietaryType && (
                                                <DiaterySymbol type={addon.dietaryType} size={12} />
                                            )}
                                            <span
                                                className={`text-sm tracking-tight ${
                                                    isSelected
                                                        ? "text-neutral-900 dark:text-neutral-100 font-medium"
                                                        : "text-neutral-700 dark:text-neutral-300 font-normal"
                                                }`}
                                            >
                                                {optionName}
                                            </span>
                                        </div>
                                    </div>
                                    <span
                                        className={`text-sm font-medium tracking-tight ${
                                            isSelected
                                                ? "text-neutral-900 dark:text-neutral-100"
                                                : "text-neutral-500 dark:text-neutral-400"
                                        }`}
                                    >
                                        +₹{optionPrice}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )})}
        </>
    );
}

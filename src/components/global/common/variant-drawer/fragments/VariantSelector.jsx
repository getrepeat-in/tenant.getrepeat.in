export function VariantSelector({ variants, selectedCustomizations, handleVariantSelect }) {
    if (!variants || variants.length === 0) return null;

    return (
        <>
            {variants.map((variant, idx) => {
                const vKey = variant.name || variant.property_name || `variant-${idx}`;
                return (
                    <div
                        key={variant._id || vKey}
                        className="flex flex-col gap-2.5"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="text-[14px] sm:text-[15px] font-bold text-neutral-900 dark:text-neutral-100 tracking-tight capitalize">
                                Choose {vKey}
                            </h4>
                            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                                Required
                            </span>
                        </div>

                        <div className="flex flex-col gap-2">
                            {variant.options?.map((option) => {
                                const isSelected = selectedCustomizations[vKey] === option.name;

                                return (
                                    <label
                                        key={option._id || option.name}
                                        onClick={() => handleVariantSelect(vKey, option.name)}
                                        className={`flex items-center justify-between cursor-pointer rounded-xl p-3.5 border transition-all duration-200 select-none ${
                                            isSelected
                                                ? "border-primary bg-primary/5 shadow-2xs dark:bg-primary/10"
                                                : "border-neutral-200/80 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-900/50 hover:bg-neutral-100/50 dark:hover:bg-zinc-850"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
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
                                            <span
                                                className={`text-sm tracking-tight ${
                                                    isSelected
                                                        ? "text-neutral-900 dark:text-neutral-100 font-medium"
                                                        : "text-neutral-700 dark:text-neutral-300 font-normal"
                                                }`}
                                            >
                                                {option.name}
                                            </span>
                                        </div>
                                        <span
                                            className={`text-sm font-medium tracking-tight ${
                                                isSelected
                                                    ? "text-neutral-900 dark:text-neutral-100"
                                                    : "text-neutral-500 dark:text-neutral-400"
                                            }`}
                                        >
                                            ₹{option.price}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </>
    );
}

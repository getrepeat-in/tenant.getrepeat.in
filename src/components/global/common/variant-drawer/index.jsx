"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useVariantDrawer } from "./helpers/useVariantDrawer";
import { VariantSelector } from "./fragments/VariantSelector";
import { AddonGroupSelector } from "./fragments/AddonGroupSelector";
import { VariantDrawerFooter } from "./fragments/VariantDrawerFooter";
import { VariantDrawerHeader } from "./fragments/VariantDrawerHeader";

export default function VariantDrawer({ isOpen, setIsOpen, item }) {
    const { selectedCustomizations, itemAddonGroups, currentPrice, localQuantity, setLocalQuantity, handleAdd, toggleAddon, handleVariantSelect } = useVariantDrawer({ isOpen, setIsOpen, item });

    if (!item) return null;

    const hasVariants = item.variants && item.variants.length > 0;
    const hasAddons = itemAddonGroups && itemAddonGroups.length > 0;
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent
                side="bottom"
                showCloseButton={false}
                className="rounded-t-[28px] sm:rounded-t-[32px] p-0 bg-white dark:bg-zinc-950 max-h-[90vh] overflow-hidden flex flex-col max-w-lg mx-auto border-t border-neutral-100 dark:border-zinc-800 shadow-2xl"
            >
                <div className="flex-1 overflow-y-auto pb-4 no-scrollbar">
                    <VariantDrawerHeader
                        item={item}
                        currentPrice={currentPrice}
                        setIsOpen={setIsOpen}
                    />

                    {(hasVariants || hasAddons) && (
                        <div className="px-5 py-4 flex flex-col gap-6 border-t border-neutral-100 dark:border-zinc-850 mt-3">
                            <VariantSelector
                                variants={item.variants}
                                selectedCustomizations={selectedCustomizations}
                                handleVariantSelect={handleVariantSelect}
                            />

                            <AddonGroupSelector
                                itemAddonGroups={itemAddonGroups}
                                selectedCustomizations={selectedCustomizations}
                                toggleAddon={toggleAddon}
                            />
                        </div>
                    )}
                </div>

                <VariantDrawerFooter
                    localQuantity={localQuantity}
                    setLocalQuantity={setLocalQuantity}
                    handleAdd={handleAdd}
                    currentPrice={currentPrice}
                />
            </SheetContent>
        </Sheet>
    );
}

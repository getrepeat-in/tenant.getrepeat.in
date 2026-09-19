"use client";
import { cn, getImageUrl } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { useRestaurant } from "@/hooks/useRestaurant";

export function ItemImage({
    src,
    alt = "Item Image",
    className,
    variant = "card",
    loading = "lazy",
}) {
    const { restaurant } = useRestaurant();
    const logoUrl = restaurant?.logo;

    const formattedSrc = getImageUrl(src, true, variant);
    const formattedLogoUrl = getImageUrl(logoUrl, true, "thumbnail");

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        setIsLoading(true);
        setHasError(false);

        if (imgRef.current && imgRef.current.complete) {
            if (imgRef.current.naturalHeight === 0) {
                setHasError(true);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        }
    }, [formattedSrc]);

    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const showPlaceholder = !formattedSrc || hasError;

    return (
        <div className={cn("relative overflow-hidden bg-slate-50 dark:bg-zinc-850 w-full h-full flex items-center justify-center select-none", className)}>
            {isLoading && !showPlaceholder && (
                <div className="absolute inset-0 bg-neutral-200 dark:bg-zinc-800 animate-pulse z-0" />
            )}

            {showPlaceholder ? (
                <div className="relative flex flex-col items-center justify-center w-full h-full bg-neutral-100/90 dark:bg-zinc-800/90 overflow-hidden">
                    {formattedLogoUrl ? (
                        <img
                            src={formattedLogoUrl}
                            alt={restaurant?.name || "Restaurant Logo"}
                            className="w-full h-full object-cover filter grayscale opacity-20 contrast-90 transition-all duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-zinc-800 text-neutral-400 font-bold text-xs sm:text-sm uppercase">
                            {(alt || restaurant?.name || "R")[0]}
                        </div>
                    )}
                </div>
            ) : (
                <img
                    ref={imgRef}
                    src={formattedSrc}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading={loading}
                    className={cn(
                        "h-full w-full object-cover transition-all duration-500 ease-in-out",
                        isLoading ? "scale-105 blur-xs" : "scale-100 blur-none"
                    )}
                />
            )}
        </div>
    );
}

export default ItemImage;

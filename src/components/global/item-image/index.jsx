"use client";
import { cn, getImageUrl } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { useRestaurant } from "@/hooks/useRestaurant";

export function ItemImage({ src, alt, className }) {
    const { restaurant } = useRestaurant();
    const logoUrl = restaurant?.logo;
    const formattedSrc = getImageUrl(src, true, "card");
    const formattedLogoUrl = getImageUrl(logoUrl, true, "card");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        setError(false);
        if (imgRef.current && imgRef.current.complete) {
            if (imgRef.current.naturalHeight === 0) {
                setError(true);
                setLoading(false);
            } else {
                setLoading(false);
            }
        }
    }, [formattedSrc]);

    const handleLoad = () => {
        setLoading(false);
    };

    const handleError = () => {
        setLoading(false);
        setError(true);
    };

    const showPlaceholder = !formattedSrc || error;

    return (
        <div className={cn("relative overflow-hidden bg-slate-50 w-full h-full flex items-center justify-center select-none", className)}>
            {loading && !showPlaceholder && (
                <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
            )}

            {showPlaceholder ? (
                <div className="flex flex-col items-center justify-center w-full h-full bg-neutral-50/50">
                    {formattedLogoUrl ? (
                        <img
                            src={formattedLogoUrl}
                            alt={restaurant?.name || "Restaurant Logo"}
                            className="w-full h-full object-cover opacity-15 filter grayscale transition-all duration-300"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-black text-xl uppercase opacity-50">
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
                    loading="lazy"
                    className={cn(
                        "h-full w-full object-cover transition-all duration-500 ease-in-out",
                        loading ? "scale-105 blur-xs" : "scale-100 blur-none"
                    )}
                />
            )}
        </div>
    );
}

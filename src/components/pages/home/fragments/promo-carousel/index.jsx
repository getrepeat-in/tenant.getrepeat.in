"use client";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { PromoCarouselSkeleton } from "@/components/skeleton";

export const PromoCarousel = ({ banners, isLoading = false }) => {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const isEnabled = banners?.isEnabled ?? true;
    const displayBanners = Array.isArray(banners) ? banners : (banners?.items || []);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const scrollLeft = scrollRef.current.scrollLeft;
        const width = scrollRef.current.offsetWidth * 0.95;
        const index = Math.round(scrollLeft / width);
        setActiveIndex(index >= displayBanners.length ? displayBanners.length - 1 : index);
    };

    const scrollTo = (index) => {
        if (!scrollRef.current) return;
        const itemWidth = scrollRef.current.offsetWidth * 0.95;
        const gap = 16;
        scrollRef.current.scrollTo({
            left: (itemWidth + gap) * index,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        if (displayBanners.length <= 1 || isHovered) return;

        const intervalId = setInterval(() => {
            const nextIndex = (activeIndex + 1) % displayBanners.length;
            scrollTo(nextIndex);
        }, 4000);

        return () => clearInterval(intervalId);
    }, [activeIndex, isHovered, displayBanners.length]);

    if (isLoading) return <PromoCarouselSkeleton />;

    if (isEnabled === false || !displayBanners || displayBanners.length === 0) return null;


    return (
        <section
            className="relative w-full px-4 pt-6 pb-2 sm:px-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
        >
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex w-full snap-x snap-mandatory overflow-x-auto hide-scrollbar gap-4 pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {displayBanners.map((offer, index) => {
                    const imgUrl = getImageUrl(offer.image, true, "detail");
                    const hasText = offer.title || offer.subtitle || offer.ctaText;

                    const CardWrapper = offer.ctaLink ? Link : "div";
                    const wrapperProps = offer.ctaLink ? { href: offer.ctaLink } : {};

                    return (
                        <CardWrapper
                            {...wrapperProps}
                            key={offer._id || offer.id || index}
                            className="group relative flex aspect-video w-[90%] shrink-0 snap-center overflow-hidden rounded-[20px] bg-gray-100 sm:w-[85%] md:w-[80%] shadow-sm"
                        >
                            <Image
                                src={imgUrl}
                                alt={offer.title || `Promotion ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 90vw, 80vw"
                                priority={index === 0}
                            />

                            {hasText && (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                                    <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 pointer-events-none">
                                        {offer.title && (
                                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-1.5 drop-shadow-lg leading-tight tracking-tight">
                                                {offer.title}
                                            </h3>
                                        )}
                                        {offer.subtitle && (
                                            <p className="text-sm sm:text-base md:text-lg text-white/90 font-medium mb-5 drop-shadow-md">
                                                {offer.subtitle}
                                            </p>
                                        )}
                                        {offer.ctaText && (
                                            <div>
                                                <span className="inline-flex items-center justify-center bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/80 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5 pointer-events-auto">
                                                    {offer.ctaText}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </CardWrapper>
                    );
                })}
            </div>

            {displayBanners.length > 1 && (
                <div className="mt-1 flex items-center justify-center gap-2">
                    {displayBanners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === index
                                ? "w-6 bg-primary"
                                : "w-1.5 bg-gray-300 hover:bg-gray-400"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default PromoCarousel;


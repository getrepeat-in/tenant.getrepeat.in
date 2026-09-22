import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function EmptyState({ 
    icon: Icon,
    badgeIcon: BadgeIcon,
    badgeText,
    title,
    description,
    buttonText,
    buttonLink = "/menu",
    buttonIcon: ButtonIcon = ArrowRight
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[65vh] px-4 py-12 text-center select-none animate-in fade-in duration-500">
            {/* Glowing Icon Container */}
            <div className="relative mb-6 flex items-center justify-center">
                <div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl animate-pulse" />
                <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-3xl bg-white dark:bg-zinc-850 border border-gray-150 dark:border-zinc-750 text-neutral-800 dark:text-neutral-200 shadow-md">
                    {Icon && <Icon className="h-12 w-12 sm:h-14 sm:w-14 text-primary stroke-[1.75]" />}
                </div>
            </div>

            {/* Badge */}
            {(BadgeIcon || badgeText) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-neutral-100 dark:bg-zinc-850 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-zinc-800 mb-3">
                    {BadgeIcon && <BadgeIcon size={12} className="text-primary" />}
                    {badgeText}
                </span>
            )}

            {/* Text */}
            <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-zinc-100 tracking-tight">
                {title}
            </h2>
            <p className="mt-2 max-w-xs text-xs sm:text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 font-normal">
                {description}
            </p>

            {/* Action CTA */}
            {buttonText && (
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
                    <Link
                        href={buttonLink}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:brightness-95 active:scale-[0.98] transition-all cursor-pointer"
                    >
                        <span>{buttonText}</span>
                        {ButtonIcon && <ButtonIcon size={16} strokeWidth={2} />}
                    </Link>
                </div>
            )}
        </div>
    );
}

export default EmptyState;

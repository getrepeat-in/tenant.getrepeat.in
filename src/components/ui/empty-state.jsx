import * as React from "react";
import { cn } from "@/lib/utils";

const badgeColors = {
    red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    orange: "bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    green: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    neutral: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
};

const badgeDotColors = {
    red: "bg-red-500",
    orange: "bg-primary",
    blue: "bg-blue-500",
    green: "bg-green-500",
    neutral: "bg-neutral-500",
};

export function EmptyState({
    image,
    icon: Icon,
    title,
    description,
    badgeText,
    badgeColor = "neutral",
    className,
    imageClassName,
}) {
    return (
        <div className={cn("flex w-full flex-col items-center justify-center px-6 py-12", className)}>
            <div className="flex w-full max-w-sm flex-col items-center text-center">

                {image && (
                    <div className={cn("relative mb-8 w-full overflow-hidden", imageClassName)}>
                        <img
                            src={image}
                            alt={title || "Empty State"}
                            className="h-auto w-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </div>
                )}

                {Icon && !image && (
                    <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary">
                        <Icon size={42} strokeWidth={1.5} />
                    </div>
                )}

                {badgeText && (
                    <div className={cn("mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider", badgeColors[badgeColor] || badgeColors.neutral)}>
                        <span className="relative flex h-2 w-2">
                            <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", badgeDotColors[badgeColor] || badgeDotColors.neutral)}></span>
                            <span className={cn("relative inline-flex h-2 w-2 rounded-full", badgeDotColors[badgeColor] || badgeDotColors.neutral)}></span>
                        </span>
                        {badgeText}
                    </div>
                )}

                {title && (
                    <h2 className="mb-3 font-heading text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        {title}
                    </h2>
                )}

                {description && (
                    <p className="max-w-[280px] text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { BUTTON_VARIANTS } from "./helpers/constants";

const Button = React.forwardRef(({ className, variant = "primary", size = "md", isLoading = false, icon, iconPosition = "left", href, disabled, children, type = "button", onClick, ...props }, ref) => {
    const isLink = typeof href !== "undefined";
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const variantClasses = BUTTON_VARIANTS.variant[variant] || BUTTON_VARIANTS.variant.primary;
    const sizeClasses = BUTTON_VARIANTS.size[size] || BUTTON_VARIANTS.size.md;
    const classes = cn(baseClasses, variantClasses, sizeClasses, className);
    const content = (
        <>
            {isLoading && <Loader2 className={cn("h-4 w-4 animate-spin shrink-0", children ? "mr-2" : "")} />}
            {!isLoading && icon && iconPosition === "left" && (
                <span className={cn("shrink-0 flex items-center justify-center", children ? "mr-2" : "")}>{icon}</span>
            )}
            {children}
            {!isLoading && icon && iconPosition === "right" && (
                <span className={cn("shrink-0 flex items-center justify-center", children ? "ml-2" : "")}>{icon}</span>
            )}
        </>
    );

    if (isLink) {
        return (
            <Link
                href={disabled || isLoading ? "#" : href}
                className={cn(classes, (disabled || isLoading) && "pointer-events-none opacity-50")}
                ref={ref}
                onClick={onClick}
                {...props}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || isLoading}
            ref={ref}
            onClick={onClick}
            {...props}
        >
            {content}
        </button>
    );
});

Button.displayName = "Button";
export default Button;
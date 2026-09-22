export const BUTTON_VARIANTS = {
    variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        danger: "bg-red-500 text-white hover:bg-red-600",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-emerald-500 text-white hover:bg-emerald-600",
        warning: "bg-amber-500 text-white hover:bg-amber-600",
        info: "bg-blue-500 text-white hover:bg-blue-600",
        muted: "bg-muted text-muted-foreground hover:bg-muted/80",
    },
    size: {
        sm: "h-9 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
    }
};
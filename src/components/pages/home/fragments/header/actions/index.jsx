
export function HeaderActionButton({ action }) {
    return (
        <button
            type="button"
            aria-label={action.ariaLabel}
            onClick={action.onClick}
            disabled={action.disabled}
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-50/60 text-neutral-700 border border-gray-150/40 transition hover:bg-neutral-100/50 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
            <span className="flex items-center justify-center">
                {action.icon && typeof action.icon === 'object' && 'props' in action.icon 
                    ? {...action.icon, props: { ...action.icon.props, size: 18 }} 
                    : action.icon}
            </span>

            {action.badge !== undefined && action.badge !== null && (
                <span
                    className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white"
                >
                    {action.badge}
                </span>
            )}
        </button>
    );
}
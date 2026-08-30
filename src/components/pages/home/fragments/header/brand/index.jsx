export function HeaderBrand({ brand }) {
    const {
        greeting,
        name,
        logo,
        tagline,
        showGreeting = true,
        showTagline = true,
    } = brand;

    return (
        <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-3">
                {logo && (
                    <div
                    // className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                    >
                        {logo}
                    </div>
                )}

                <div className="min-w-0">
                    {showGreeting && greeting && (
                        <div className="mb-0.5 truncate text-sm font-medium leading-5 text-neutral-600 sm:text-base">
                            {greeting}
                        </div>
                    )}

                    <div className="truncate text-xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-2xl">
                        {name}
                    </div>

                    {/* {showTagline && tagline && (
                        <div className="hidden truncate text-xs leading-5 text-neutral-500 sm:block sm:text-sm">
                            {tagline}
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
}
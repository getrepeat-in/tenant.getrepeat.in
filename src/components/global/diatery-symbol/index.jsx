const DiaterySymbol = ({
    type,
    size = 16,
    className = ""
}) => {
    if (!type) return null;
    const lowerType = type?.toLowerCase();
    const isVeg = lowerType === "veg" || lowerType === "vegetarian";
    const isEgg = lowerType === "egg" || lowerType === "eggetarian" || lowerType === "contains egg";
    
    if (isVeg) {
        return (
            <span
                style={{ width: size, height: size }}
                className={`inline-flex shrink-0 items-center justify-center rounded-[3px] border-[1.5px] border-[#0f8a3c] bg-white p-[2px] ${className}`}
                title="Vegetarian"
            >
                <span className="w-full h-full rounded-full bg-[#0f8a3c]" />
            </span>
        );
    }

    if (isEgg) {
        return (
            <span
                style={{ width: size, height: size }}
                className={`inline-flex shrink-0 items-center justify-center rounded-[3px] border-[1.5px] border-[#eab308] bg-white p-[2px] ${className}`}
                title="Contains Egg"
            >
                <span className="w-full h-full rounded-full bg-[#eab308]" />
            </span>
        );
    }

    return (
        <span
            style={{ width: size, height: size }}
            className={`inline-flex shrink-0 items-center justify-center rounded-[3px] border-[1.5px] border-[#9c1818] bg-white p-[1.5px] ${className}`}
            title="Non-Vegetarian"
        >
            <svg
                viewBox="0 0 10 10"
                className="w-full h-full"
                fill="#9c1818"
                xmlns="http://www.w3.org/2000/svg"
            >
                <polygon points="5,1 9.5,9 0.5,9" />
            </svg>
        </span>
    );
};

export default DiaterySymbol;
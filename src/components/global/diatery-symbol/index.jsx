const DiaterySymbol = ({
    type,
    size = 16
}) => {
    if (!type) return null;
    const lowerType = type?.toLowerCase();
    const isVeg = lowerType === "veg" || lowerType === "vegetarian";
    const isEgg = lowerType === "egg" || lowerType === "eggetarian" || lowerType === "contains egg";
    const containerStyle = { width: size, height: size };
    const innerSize = Math.max(Math.floor(size * 0.5), 4);

    if (isVeg) {
        return (
            <div style={containerStyle} className="flex shrink-0 items-center justify-center rounded-[3px] border border-green-600">
                <div style={{ width: innerSize, height: innerSize }} className="rounded-full bg-green-600"></div>
            </div>
        );
    }

    if (isEgg) {
        return (
            <div style={containerStyle} className="flex shrink-0 items-center justify-center rounded-[3px] border border-[#eab308]">
                <div style={{ width: innerSize, height: innerSize }} className="rounded-full bg-[#eab308]"></div>
            </div>
        );
    }

    return (
        <div style={containerStyle} className="flex shrink-0 items-center justify-center rounded-[3px] border border-[#8c1818]">
            <svg width={innerSize + 2} height={innerSize + 2} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 1L9.33013 8.5H0.669873L5 1Z" fill="#8c1818" />
            </svg>
        </div>
    );
};

export default DiaterySymbol;
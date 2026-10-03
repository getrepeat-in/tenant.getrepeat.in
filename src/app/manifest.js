import { headers } from "next/headers";

export default async function manifest() {
    const headersList = await headers();
    const host = headersList.get("host") || "";
    let slug = "mithanlals";

    const parts = host.split(".");
    if (parts.length > 0 && parts[0] !== "localhost" && parts[0] !== "www" && parts[0] !== "127") {
        slug = parts[0];
    }

    let restaurantName = "Repeat";
    let restaurantLogo = "/logo.png";
    let description = "Order delicious food, beverages, and explore the best culinary offerings with Repeat.";

    try {
        const merchantAppUrl = process.env.MERCHANT_APP_URL || "http://localhost:3001";
        const res = await fetch(`${merchantAppUrl}/api/${slug}`, { next: { revalidate: 60 } });
        if (res.ok) {
            const data = await res.json();
            const restaurant = data?.data || data;
            if (restaurant?.name) {
                restaurantName = restaurant.name;
                description = `Order delicious food from ${restaurantName}.`;
            }
            if (restaurant?.logo) {
                restaurantLogo = restaurant.logo;
            }
        }
    } catch (error) {
        console.error("Failed to fetch restaurant metadata for manifest:", error);
    }

    return {
        name: restaurantName,
        short_name: restaurantName,
        description: description,
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
            {
                src: restaurantLogo,
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: restaurantLogo,
                sizes: "512x512",
                type: "image/png",
            },
            {
                src: restaurantLogo,
                sizes: "1024x1024",
                type: "image/png",
            }
        ],
    };
}

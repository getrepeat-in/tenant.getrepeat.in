import { ItemCard } from "@/components/pages/home/fragments/menu-layout/fragments/item-card";

export function SearchResults({ results }) {
    return (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {results.map((item) => (
                <ItemCard.V1 key={item?._id || item?.id} item={item} />
            ))}
        </div>
    );
}

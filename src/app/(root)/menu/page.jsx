import { Suspense } from "react";
import Menu from "@/components/pages/menu";
import { MenuSkeleton } from "@/components/skeleton";

const Page = () => {
    return (
        <Suspense fallback={<MenuSkeleton />}>
            <Menu />
        </Suspense>
    );
};

export default Page;
import { InstagramPosts } from "@/components/pages/home/fragments/instagram-posts";

export const metadata = {
    title: "Social - Our Latest Updates",
};

export default function SocialPage() {
    return (
        <div className="w-full h-[calc(100dvh-56px)] md:h-screen bg-zinc-950 overflow-hidden relative select-none">
            <div className="max-w-md mx-auto h-full relative">
                <InstagramPosts layout="vertical" />
            </div>
        </div>
    );
}

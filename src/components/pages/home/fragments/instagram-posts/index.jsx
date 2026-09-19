"use client";
import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRestaurant } from "@/hooks/useRestaurant";
import { InstagramService } from "@/services/frontend/instagram";
import {
    Camera,
    ExternalLink,
    Volume2,
    VolumeX,
    Heart,
    Share2,
    ShoppingBag,
    Play,
    Pause,
    Plus,
    Check,
    Music2,
    Sparkles,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "@/store/slices/cartSlice";
import VariantDrawer from "@/components/global/variant-drawer";
import { ItemImage } from "@/components/global/item-image";
import DiaterySymbol from "@/components/global/diatery-symbol";
import useNotification from "@/hooks/useNotification";
import { getImageUrl, cn } from "@/lib/utils";

const InstagramVideo = ({
    src,
    isMuted,
    isVertical,
    isPlaying,
    onTogglePlay,
}) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (!videoRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoRef.current?.play().catch(() => {});
                    } else {
                        videoRef.current?.pause();
                    }
                });
            },
            { threshold: 0.6 }
        );

        observer.observe(videoRef.current);

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.play().catch(() => {});
        } else {
            videoRef.current.pause();
        }
    }, [isPlaying]);

    return (
        <div
            className="relative h-full w-full flex items-center justify-center cursor-pointer"
            onClick={onTogglePlay}
        >
            <video
                ref={videoRef}
                src={src}
                muted={isMuted}
                loop
                playsInline
                className={cn(
                    "relative z-10 h-full w-full object-cover transition-transform duration-500",
                    !isVertical && "group-hover:scale-105"
                )}
            />
        </div>
    );
};

const GlassItemCard = ({ item }) => {
    const dispatch = useDispatch();
    const { restaurant, slug } = useRestaurant();
    const notify = useNotification();
    const [isVariantDrawerOpen, setIsVariantDrawerOpen] = useState(false);

    const basePrice = item?.price || item?.base_price || item?.defaultPrice || 0;
    const hasCustomizations = item?.variants?.length > 0 || item?.addonGroups?.length > 0;

    const cartItems = useSelector((state) => state.cart.items || []);
    const totalItemQuantity = cartItems
        .filter((i) => i.item?._id === item._id || i.item?.id === item.id)
        .reduce((sum, current) => sum + current.quantity, 0);

    const handleAdd = (e) => {
        if (e) e.stopPropagation();
        if (hasCustomizations) {
            setIsVariantDrawerOpen(true);
        } else {
            dispatch(
                addItem({
                    item,
                    restaurantId: restaurant?._id || restaurant?.id || slug,
                    selectedCustomizations: {},
                })
            );
            notify.success(`Added ${item.name} to cart!`, { duration: 2000 });
        }
    };

    const dietary = (item?.dietaryType || item?.dietary_type || item?.food_type || "").toUpperCase();

    return (
        <>
            <div
                className="relative flex min-w-[142px] w-[142px] sm:min-w-[155px] sm:w-[155px] shrink-0 snap-start flex-col rounded-2xl bg-black/65 hover:bg-black/80 dark:bg-zinc-950/75 dark:hover:bg-zinc-950/90 backdrop-blur-2xl p-2.5 transition-all duration-300 border border-white/20 hover:border-white/35 shadow-[0_10px_30px_rgba(0,0,0,0.5)] pointer-events-auto cursor-pointer group active:scale-[0.98]"
                onClick={handleAdd}
            >
                {/* Image Container */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-800/90 mb-2">
                    <ItemImage
                        src={item?.image}
                        alt={item?.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />

                    {/* Dietary badge */}
                    {dietary && (
                        <div className="absolute top-1.5 left-1.5 p-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/15 shadow-2xs">
                            <DiaterySymbol type={dietary} size={11} />
                        </div>
                    )}

                    {/* Customisable indicator */}
                    {hasCustomizations && (
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[8.5px] font-semibold text-amber-300 border border-amber-300/30 shadow-2xs">
                            Custom
                        </div>
                    )}

                    {/* Subtle bottom shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Dish Info & Action */}
                <div className="flex flex-col gap-1.5 px-0.5">
                    <h3 className="text-xs font-semibold leading-tight text-white line-clamp-1 group-hover:text-primary transition-colors">
                        {item.name}
                    </h3>

                    <div className="flex items-center justify-between gap-1 pt-0.5">
                        <div className="flex items-baseline">
                            <span className="text-[13px] sm:text-sm font-bold text-white tracking-tight font-mono">
                                ₹{basePrice}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handleAdd}
                            aria-label={`Add ${item.name}`}
                            className={cn(
                                "flex size-7 shrink-0 items-center justify-center rounded-xl transition-all duration-300 shadow-md cursor-pointer",
                                totalItemQuantity > 0
                                    ? "bg-primary text-primary-foreground font-bold text-xs shadow-primary/30 scale-105"
                                    : "bg-white text-neutral-900 hover:bg-neutral-100 hover:scale-105 active:scale-90"
                            )}
                        >
                            {totalItemQuantity > 0 ? (
                                <span className="text-[11px] font-bold">{totalItemQuantity}</span>
                            ) : (
                                <Plus size={14} strokeWidth={2.6} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {hasCustomizations && (
                <VariantDrawer
                    isOpen={isVariantDrawerOpen}
                    setIsOpen={setIsVariantDrawerOpen}
                    item={item}
                />
            )}
        </>
    );
};

export const InstagramPosts = ({ layout = "horizontal" }) => {
    const { slug, restaurant } = useRestaurant();
    const notify = useNotification();
    const [isMuted, setIsMuted] = useState(true);
    const [expandedCaptionId, setExpandedCaptionId] = useState(null);
    const [likedPosts, setLikedPosts] = useState({});
    const [playingState, setPlayingState] = useState({});
    const [actionFeedback, setActionFeedback] = useState(null);

    const { data: posts = [], isPending } = useQuery({
        queryKey: ["instagram-posts", slug],
        queryFn: async () => {
            const data = await InstagramService.getPosts(slug);
            return data || [];
        },
        enabled: !!slug,
    });

    const isVertical = layout === "vertical";

    const toggleMute = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setIsMuted((prev) => !prev);
    };

    const togglePlay = (postId) => {
        setPlayingState((prev) => {
            const currentlyPlaying = prev[postId] !== false;
            const nextState = !currentlyPlaying;
            
            // Show feedback ripple
            setActionFeedback({
                id: postId,
                type: nextState ? "play" : "pause",
            });
            setTimeout(() => setActionFeedback(null), 700);

            return { ...prev, [postId]: nextState };
        });
    };

    const handleLike = (postId, e) => {
        if (e) e.stopPropagation();
        setLikedPosts((prev) => {
            const next = !prev[postId];
            if (next) {
                setActionFeedback({ id: postId, type: "heart" });
                setTimeout(() => setActionFeedback(null), 900);
            }
            return { ...prev, [postId]: next };
        });
    };

    const handleShare = async (post, e) => {
        if (e) e.stopPropagation();
        const postUrl = post?.permalink || `https://instagram.com/${post?.username || ""}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: restaurant?.name || "Restaurant Social",
                    text: post?.caption?.slice(0, 100) || "Check out this update!",
                    url: postUrl,
                });
                return;
            } catch {
                // Ignore cancel
            }
        }

        try {
            await navigator.clipboard.writeText(postUrl);
            notify.success("Link copied to clipboard!", { duration: 2500 });
        } catch {
            window.open(postUrl, "_blank");
        }
    };

    if (isPending) {
        if (isVertical) {
            return (
                <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4">
                    <div className="w-full max-w-sm aspect-[9/16] rounded-3xl bg-zinc-900 border border-zinc-800 animate-pulse flex flex-col justify-between p-5">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-zinc-800" />
                            <div className="space-y-1.5 flex-1">
                                <div className="h-3 w-28 rounded bg-zinc-800" />
                                <div className="h-2 w-16 rounded bg-zinc-800" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 w-3/4 rounded bg-zinc-800" />
                            <div className="h-3 w-1/2 rounded bg-zinc-800" />
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

    if (!posts || posts.length === 0) {
        if (isVertical) {
            return (
                <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-6 text-center text-white">
                    <div className="size-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-neutral-400">
                        <Camera size={28} />
                    </div>
                    <h3 className="text-base font-semibold text-zinc-100">No Stories Yet</h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                        Check back soon for latest delicious updates and behind-the-scenes moments.
                    </p>
                </div>
            );
        }
        return null;
    }

    return (
        <section
            className={cn(
                "w-full flex flex-col animate-in fade-in duration-500",
                isVertical
                    ? "h-full bg-black relative select-none"
                    : "mt-4 mb-6 gap-4 slide-in-from-bottom-4"
            )}
        >
            {/* Header for Horizontal Layout */}
            {!isVertical && (
                <div className="px-4 md:px-6 flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                        <span className="bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                            Shop the Feed
                        </span>
                        <Sparkles size={16} className="text-pink-500" />
                    </h2>
                    <a
                        href={`https://instagram.com/${posts[0]?.username || ""}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                        <span>Follow Us</span>
                        <ExternalLink size={13} />
                    </a>
                </div>
            )}

            {/* Posts Container */}
            <div
                className={cn(
                    "flex",
                    isVertical
                        ? "flex-col h-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
                        : "gap-4 overflow-x-auto px-4 md:px-6 pb-4 snap-x snap-mandatory"
                )}
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {posts.map((post) => {
                    const imageUrl =
                        post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url;
                    const isVideo = post.media_type === "VIDEO";
                    const isShoppable = post.mappedItems && post.mappedItems.length > 0;
                    const isLiked = Boolean(likedPosts[post.id]);
                    const isPlaying = playingState[post.id] !== false;
                    const feedback = actionFeedback?.id === post.id ? actionFeedback.type : null;

                    return (
                        <div
                            key={post.id}
                            className={cn(
                                "relative flex shrink-0 snap-start flex-col overflow-hidden group bg-zinc-950",
                                isVertical
                                    ? "w-full h-full min-h-[100%] max-h-full"
                                    : "min-w-[150px] w-[150px] aspect-[9/16] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-150/80 dark:border-zinc-800"
                            )}
                        >
                            {/* Ambient Blurred Background for 9:16 portrait fill */}
                            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                                <img
                                    src={imageUrl}
                                    alt="ambient background"
                                    className="h-full w-full object-cover blur-2xl opacity-35 scale-125"
                                />
                            </div>

                            {/* Main Media (Video or Image) */}
                            {isVideo ? (
                                <InstagramVideo
                                    src={post.media_url}
                                    isMuted={isMuted}
                                    isVertical={isVertical}
                                    isPlaying={isPlaying}
                                    onTogglePlay={() => togglePlay(post.id)}
                                />
                            ) : (
                                <div
                                    className="relative z-10 h-full w-full flex items-center justify-center cursor-pointer"
                                    onClick={() => handleLike(post.id)}
                                >
                                    <img
                                        src={imageUrl}
                                        alt={post.caption || "Instagram post"}
                                        className={cn(
                                            "h-full w-full object-cover transition-transform duration-500",
                                            !isVertical && "group-hover:scale-105"
                                        )}
                                    />
                                </div>
                            )}

                            {/* Play/Pause/Heart Center Ripple Animation */}
                            {feedback && (
                                <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-in duration-200">
                                    <div className="flex size-18 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white shadow-2xl">
                                        {feedback === "play" && <Play size={32} className="fill-white" />}
                                        {feedback === "pause" && <Pause size={32} className="fill-white" />}
                                        {feedback === "heart" && (
                                            <Heart size={36} className="fill-red-500 text-red-500" />
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Dark Gradients for Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/60 pointer-events-none z-20" />

                            {/* Top Bar on Vertical Reels */}
                            {isVertical && (
                                <div className="absolute top-0 left-0 right-0 z-25 flex items-center justify-between p-4 pt-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
                                    {/* Restaurant Brand Info */}
                                    <div className="flex items-center gap-2.5">
                                        <div className="size-8 rounded-full overflow-hidden border border-white/30 bg-zinc-900 shrink-0">
                                            {restaurant?.logo ? (
                                                <img
                                                    src={getImageUrl(restaurant.logo, true, "thumbnail")}
                                                    alt={restaurant?.name || "Logo"}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground font-bold text-xs">
                                                    {(restaurant?.name || "R")[0]}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-semibold text-white drop-shadow-sm">
                                                    {restaurant?.name || "Our Restaurant"}
                                                </span>
                                                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            </div>
                                            <span className="text-[10px] font-normal text-white/70">
                                                Reels & Updates
                                            </span>
                                        </div>
                                    </div>

                                    {/* Sound & External Actions */}
                                    <div className="flex items-center gap-2">
                                        {isVideo && (
                                            <button
                                                type="button"
                                                onClick={toggleMute}
                                                className="flex size-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all cursor-pointer"
                                                aria-label={isMuted ? "Unmute" : "Mute"}
                                            >
                                                {isMuted ? (
                                                    <VolumeX size={15} strokeWidth={2} />
                                                ) : (
                                                    <Volume2 size={15} strokeWidth={2} className="text-primary" />
                                                )}
                                            </button>
                                        )}

                                        <a
                                            href={post.permalink || `https://instagram.com/${post.username || ""}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex size-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all"
                                            aria-label="Open on Instagram"
                                        >
                                            <ExternalLink size={14} strokeWidth={2} />
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Floating Right Action Rail */}
                            {isVertical && (
                                <div className="absolute right-3 bottom-28 z-25 flex flex-col items-center gap-4.5 pointer-events-auto">
                                    {/* Like Button */}
                                    <button
                                        type="button"
                                        onClick={(e) => handleLike(post.id, e)}
                                        className="flex flex-col items-center gap-1 group/btn cursor-pointer"
                                    >
                                        <div
                                            className={cn(
                                                "flex size-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 border shadow-md",
                                                isLiked
                                                    ? "bg-red-500/20 border-red-500/50 text-red-500 scale-110"
                                                    : "bg-black/40 border-white/20 text-white group-hover/btn:bg-black/60"
                                            )}
                                        >
                                            <Heart
                                                size={20}
                                                className={cn(
                                                    "transition-transform active:scale-125",
                                                    isLiked && "fill-red-500"
                                                )}
                                            />
                                        </div>
                                        <span className="text-[10px] font-semibold text-white/90 drop-shadow-sm">
                                            {isLiked ? (post.like_count || 1) + 1 : post.like_count || "Like"}
                                        </span>
                                    </button>

                                    {/* Shoppable Items Indicator Button */}
                                    {isShoppable && (
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex size-10 items-center justify-center rounded-full bg-primary/30 border border-primary/60 text-primary backdrop-blur-md shadow-md animate-pulse">
                                                <ShoppingBag size={18} />
                                            </div>
                                            <span className="text-[10px] font-semibold text-white/90 drop-shadow-sm">
                                                {post.mappedItems.length} {post.mappedItems.length === 1 ? "Dish" : "Dishes"}
                                            </span>
                                        </div>
                                    )}

                                    {/* Share Button */}
                                    <button
                                        type="button"
                                        onClick={(e) => handleShare(post, e)}
                                        className="flex flex-col items-center gap-1 group/btn cursor-pointer"
                                    >
                                        <div className="flex size-10 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white backdrop-blur-md group-hover/btn:bg-black/60 transition-all shadow-md">
                                            <Share2 size={18} />
                                        </div>
                                        <span className="text-[10px] font-semibold text-white/90 drop-shadow-sm">
                                            Share
                                        </span>
                                    </button>
                                </div>
                            )}

                            {/* Bottom Content Container */}
                            <div
                                className={cn(
                                    "absolute bottom-0 left-0 w-full flex flex-col justify-end pointer-events-none z-25",
                                    isVertical ? "p-4 pb-6" : "p-3"
                                )}
                            >
                                {/* Shoppable Dish Shelf */}
                                {isShoppable && isVertical && (
                                    <div className="w-full flex gap-2.5 overflow-x-auto pb-3 snap-x snap-mandatory pointer-events-auto no-scrollbar">
                                        {post.mappedItems.map((item) => (
                                            <GlassItemCard
                                                key={item._id || item.id}
                                                item={item}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* User & Caption Details */}
                                <div className="flex items-center gap-2 mb-1.5 pointer-events-auto">
                                    <div className="size-7 p-[1.5px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 shrink-0 shadow-xs">
                                        <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden border border-black">
                                            <Camera size={13} className="text-white" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-white drop-shadow-md">
                                            @{post.username || "instagram"}
                                        </span>

                                        <a
                                            href={`https://instagram.com/${post.username || ""}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-[10px] font-semibold text-white/95 px-2.5 py-0.5 border border-white/30 hover:bg-white/20 hover:border-white transition-all rounded-full backdrop-blur-sm"
                                        >
                                            Follow
                                        </a>
                                    </div>
                                </div>

                                {/* Caption Text with Expand */}
                                {post.caption && (
                                    <div className="pointer-events-auto">
                                        <p
                                            className={cn(
                                                "text-xs font-normal text-white/90 leading-relaxed drop-shadow-sm cursor-pointer",
                                                expandedCaptionId === post.id ? "" : "line-clamp-2"
                                            )}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setExpandedCaptionId(
                                                    expandedCaptionId === post.id ? null : post.id
                                                );
                                            }}
                                        >
                                            {post.caption}
                                            {expandedCaptionId !== post.id && post.caption.length > 65 && (
                                                <span className="font-semibold text-white/80 ml-1 hover:underline">
                                                    ...more
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                )}

                                {/* Music Tag (Reels Aesthetic) */}
                                {isVertical && (
                                    <div className="flex items-center gap-1.5 mt-2 text-[10px] font-normal text-white/60">
                                        <Music2 size={11} className="animate-pulse" />
                                        <span className="truncate">
                                            Original Audio · @{post.username || "restaurant"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default InstagramPosts;

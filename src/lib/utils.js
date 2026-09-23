import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getTenantSlug() {
  let slug = "haldiram";
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const parts = hostname.split(".");
    if (parts.length > 0 && parts[0] !== "localhost" && parts[0] !== "www" && parts[0] !== "127") {
      slug = parts[0];
    }
  }
  return slug;
}

export function getImageUrl(imageInput, useAvif = true, variant = "original") {
  if (!imageInput) return "";

  const bucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
  const region = process.env.NEXT_PUBLIC_AWS_REGION;
  const baseUrl = bucket && region ? `https://${bucket}.s3.${region}.amazonaws.com` : "";

  if (typeof imageInput === "string") {
    if (imageInput.startsWith("http://") || imageInput.startsWith("https://")) {
      return imageInput;
    }
    const cleanKey = imageInput.replace(/^\//, "");
    return baseUrl ? `${baseUrl}/${cleanKey}` : `/${cleanKey}`;
  }

  if (typeof imageInput === "object") {
    let key =
      imageInput[variant] ||
      imageInput.card ||
      imageInput.thumbnail ||
      imageInput.original ||
      imageInput.key ||
      imageInput.original?.key ||
      "";

    if (typeof key === "string" && (key.startsWith("http://") || key.startsWith("https://"))) {
      return key;
    }

    if (imageInput.variants && typeof imageInput.variants === "object") {
      let order = ["thumbnail", "card", "detail"];
      if (variant === "card") order = ["card", "detail", "thumbnail"];
      if (variant === "detail") order = ["detail", "card", "thumbnail"];

      for (const vName of order) {
        const list = imageInput.variants[vName];
        if (Array.isArray(list) && list.length > 0) {
          let selected = null;
          if (useAvif) {
            selected = list.find((v) => v.format === "avif") || list.find((v) => v.format === "webp");
          } else {
            selected = list.find((v) => v.format === "webp") || list.find((v) => v.format === "jpg") || list.find((v) => v.format === "png");
          }

          selected = selected || list[0];
          if (selected?.key) {
            key = selected.key;
            break;
          }
        }
      }
    }

    if (!key || typeof key !== "string") return "";

    const cleanKey = key.replace(/^\//, "");
    return baseUrl ? `${baseUrl}/${cleanKey}` : `/${cleanKey}`;
  }

  return "";
}


import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function getTenantSlug() {
    let slug = "khadak-singh-da-dhaba";
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

  if (typeof imageInput === "string" && (imageInput.startsWith("http://") || imageInput.startsWith("https://"))) {
    return imageInput;
  }

  let key = "";
  let variants = null;

  if (typeof imageInput === "string") {
    key = imageInput;
  } else if (imageInput && typeof imageInput === "object") {
    key = imageInput.original?.key || imageInput.key || "";
    variants = imageInput.variants;
  }

  if (!key) return "";

  const bucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
  const region = process.env.NEXT_PUBLIC_AWS_REGION;
  const baseUrl = `https://${bucket}.s3.${region}.amazonaws.com`;

  if (variant && variant !== "original" && variants) {
    let order = ["thumbnail", "card", "detail"];
    if (variant === "card") order = ["card", "detail", "thumbnail"];
    if (variant === "detail") order = ["detail", "card", "thumbnail"];

    for (const vName of order) {
      const list = variants[vName];
      if (Array.isArray(list) && list.length > 0) {
        let selected = null;
        if (useAvif) {
          selected = list.find((v) => v.format === "avif") || list.find((v) => v.format === "webp");
        } else {
          selected = list.find((v) => v.format === "webp") || list.find((v) => v.format === "jpg") || list.find((v) => v.format === "png");
        }
        
        selected = selected || list[0];
        if (selected?.key) {
          return `${baseUrl}/${selected.key}`;
        }
      }
    }
  }

  return `${baseUrl}/${key}`;
}

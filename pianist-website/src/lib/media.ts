import type { MediaItemData } from "./types";

export type MediaFilterValue = "all" | "featured" | MediaItemData["type"];

export type MediaEmbedConfig = {
  src: string;
  kind: "video" | "audio";
};

export function formatMediaType(type: MediaItemData["type"]) {
  if (type === "audio") return "Recording";
  if (type === "video") return "Video";
  return "Photo";
}

export function getMediaFilterLabel(filter: MediaFilterValue) {
  if (filter === "all") return "All";
  if (filter === "featured") return "Featured";
  if (filter === "audio") return "Audio";
  if (filter === "video") return "Video";
  return "Image";
}

export function sortMediaItems(items: MediaItemData[]) {
  return [...items].sort((a, b) => {
    const orderDiff =
      (a.order ?? Number.MAX_SAFE_INTEGER) -
      (b.order ?? Number.MAX_SAFE_INTEGER);

    if (orderDiff !== 0) return orderDiff;

    return a.title.localeCompare(b.title);
  });
}

export function sortHomepageFeaturedMediaItems(items: MediaItemData[]) {
  return [...items]
    .filter((item) => item.featured === true)
    .sort((a, b) => {
      const homepageOrderDiff =
        (a.homepageOrder ?? Number.MAX_SAFE_INTEGER) -
        (b.homepageOrder ?? Number.MAX_SAFE_INTEGER);

      if (homepageOrderDiff !== 0) return homepageOrderDiff;

      const mediaPageOrderDiff =
        (a.order ?? Number.MAX_SAFE_INTEGER) -
        (b.order ?? Number.MAX_SAFE_INTEGER);

      if (mediaPageOrderDiff !== 0) return mediaPageOrderDiff;

      return a.title.localeCompare(b.title);
    });
}

export function filterMediaItems(
  items: MediaItemData[],
  filter: MediaFilterValue,
) {
  if (filter === "all") return items;
  if (filter === "featured") return items.filter((item) => item.featured);
  return items.filter((item) => item.type === filter);
}

export function getMediaEmbedConfig(
  embedUrl?: string,
): MediaEmbedConfig | null {
  if (!embedUrl) return null;

  try {
    const url = new URL(embedUrl);
    const host = url.hostname.replace("www.", "");

    if (host === "youtu.be" || host.endsWith("youtube.com")) {
      let videoId = "";

      if (host === "youtu.be") {
        videoId = url.pathname.split("/").filter(Boolean)[0] || "";
      } else if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") || "";
      } else if (url.pathname.startsWith("/embed/")) {
        videoId = url.pathname.split("/embed/")[1] || "";
      } else if (url.pathname.startsWith("/shorts/")) {
        videoId = url.pathname.split("/shorts/")[1] || "";
      }

      if (videoId) {
        return {
          src: `https://www.youtube.com/embed/${videoId}?rel=0`,
          kind: "video",
        };
      }
    }

    if (host.endsWith("vimeo.com")) {
      const videoId = url.pathname.split("/").filter(Boolean).pop();

      if (videoId) {
        return {
          src: `https://player.vimeo.com/video/${videoId}`,
          kind: "video",
        };
      }
    }

    if (host.endsWith("spotify.com")) {
      let path = url.pathname;

      if (!path.startsWith("/embed/")) {
        path = `/embed${path}`;
      }

      return {
        src: `https://open.spotify.com${path}`,
        kind: "audio",
      };
    }

    if (host.endsWith("soundcloud.com")) {
      return {
        src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(
          url.toString(),
        )}`,
        kind: "audio",
      };
    }
  } catch {
    return null;
  }

  return null;
}

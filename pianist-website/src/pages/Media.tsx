import { useEffect, useMemo, useState } from "react";
import { ExternalLink, ImageIcon, Music2, PlayCircle, X } from "lucide-react";
import heroPhoto from "../assets/ThomasHero.jpg";
import PageHero from "../components/PageHero";
import { sanityClient, urlFor } from "../lib/sanity";
import { mediaItemsQuery, mediaPageQuery } from "../lib/queries";
import type { MediaItemData, MediaPageData } from "../lib/types";

type MediaEmbedConfig = {
  src: string;
  kind: "video" | "audio";
};

type SpotifyOEmbedResponse = {
  thumbnail_url?: string | null;
};

function formatMediaType(type: MediaItemData["type"]) {
  if (type === "audio") return "Recording";
  if (type === "video") return "Video";
  return "Photo";
}

function isSpotifyUrl(url?: string) {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    return parsed.hostname.replace("www.", "").endsWith("spotify.com");
  } catch {
    return false;
  }
}

function getYouTubeId(embedUrl?: string) {
  if (!embedUrl) return null;

  try {
    const url = new URL(embedUrl);
    const host = url.hostname.replace("www.", "");

    if (host === "youtu.be") {
      return url.pathname.replace("/", "") || null;
    }

    if (host.endsWith("youtube.com")) {
      if (url.pathname === "/watch") {
        return url.searchParams.get("v");
      }

      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.split("/embed/")[1] || null;
      }

      if (url.pathname.startsWith("/shorts/")) {
        return url.pathname.split("/shorts/")[1] || null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function getMediaEmbedConfig(embedUrl?: string): MediaEmbedConfig | null {
  if (!embedUrl) return null;

  try {
    const url = new URL(embedUrl);
    const host = url.hostname.replace("www.", "");

    if (host === "youtu.be" || host.endsWith("youtube.com")) {
      const id = getYouTubeId(embedUrl);

      if (id) {
        return {
          src: `https://www.youtube.com/embed/${id}?rel=0`,
          kind: "video",
        };
      }
    }

    if (host.endsWith("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();

      if (id) {
        return {
          src: `https://player.vimeo.com/video/${id}`,
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

function sortMediaItems(items: MediaItemData[]) {
  return [...items].sort((a, b) => {
    const featuredDiff =
      Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featuredDiff !== 0) return featuredDiff;

    const orderDiff =
      (a.order ?? Number.MAX_SAFE_INTEGER) -
      (b.order ?? Number.MAX_SAFE_INTEGER);
    if (orderDiff !== 0) return orderDiff;

    return a.title.localeCompare(b.title);
  });
}

function getMediaPreviewImage(
  item: MediaItemData,
  spotifyThumbs: Record<string, string>,
) {
  if (item.previewImage) {
    return urlFor(item.previewImage).width(1200).height(1400).fit("crop").url();
  }

  if (item.image) {
    return urlFor(item.image).width(1200).height(1400).fit("crop").url();
  }

  const youtubeId = getYouTubeId(item.embedUrl);

  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }

  if (item.embedUrl && spotifyThumbs[item.embedUrl]) {
    return spotifyThumbs[item.embedUrl];
  }

  return null;
}

function MediaTile({
  item,
  previewImage,
  onOpen,
}: {
  item: MediaItemData;
  previewImage: string | null;
  onOpen: () => void;
}) {
  const FallbackIcon =
    item.type === "video"
      ? PlayCircle
      : item.type === "audio"
        ? Music2
        : ImageIcon;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative aspect-[3/4] overflow-hidden bg-white shadow-[0_10px_24px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(36,61,120,0.10)]"
    >
      {previewImage ? (
        <img
          src={previewImage}
          alt={item.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(235,241,250,0.94))]" />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,10,17,0.22)_0%,rgba(7,10,17,0.08)_42%,rgba(7,10,17,0.12)_100%)]" />

      {!previewImage ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/14 text-white backdrop-blur-md sm:h-14 sm:w-14">
            <FallbackIcon size={18} className="sm:hidden" />
            <FallbackIcon size={24} className="hidden sm:block" />
          </div>
        </div>
      ) : null}

      <div className="absolute left-2 top-2 rounded-full border border-white/12 bg-black/24 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm sm:left-3 sm:top-3 sm:px-3 sm:text-[10px]">
        {formatMediaType(item.type)}
      </div>
    </button>
  );
}

function MediaPreviewModal({
  item,
  previewImage,
  onClose,
}: {
  item: MediaItemData;
  previewImage: string | null;
  onClose: () => void;
}) {
  const embed = getMediaEmbedConfig(item.embedUrl);
  const imageUrl = item.image
    ? urlFor(item.image).width(2200).height(1600).fit("max").url()
    : previewImage;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  if (item.type === "image") {
    return (
      <div
        className="fixed inset-0 z-[90] bg-black/72 p-3 backdrop-blur-md sm:p-6"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className="relative mx-auto flex h-full max-w-7xl items-center justify-center">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image preview"
            className="absolute right-2 top-2 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-black/28 text-white backdrop-blur-sm transition-colors hover:bg-black/42 sm:right-4 sm:top-4"
          >
            <X size={18} />
          </button>

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.title}
              className="max-h-full max-w-full rounded-[1.2rem] object-contain shadow-[0_26px_80px_rgba(0,0,0,0.36)]"
            />
          ) : (
            <div className="rounded-[1.2rem] bg-white px-6 py-5 text-[var(--foreground)]">
              Image preview unavailable.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/72 p-3 backdrop-blur-md sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0b0f18] shadow-[0_30px_100px_rgba(0,0,0,0.28)]">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/88">
              {formatMediaType(item.type)}
            </span>
            <p className="hidden text-sm text-white/70 sm:block">
              {item.title}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {item.embedUrl ? (
              <a
                href={item.embedUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Open media externally"
                className="inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-full !border !border-white/30 !bg-white/14 px-3 !text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition-colors hover:!bg-white/22 sm:px-4"
                style={{ color: "#ffffff" }}
              >
                <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-white sm:inline">
                  Open
                </span>
                <ExternalLink size={14} className="text-white" />
              </a>
            ) : null}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close media preview"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-white/8 text-white transition-colors hover:bg-white/14"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center px-3 pb-3 sm:px-6 sm:pb-6">
          {embed?.kind === "video" ? (
            <div className="w-full overflow-hidden rounded-[1.2rem] bg-black shadow-[0_18px_44px_rgba(0,0,0,0.28)]">
              <div className="aspect-video w-full">
                <iframe
                  src={embed.src}
                  title={item.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          ) : embed?.kind === "audio" ? (
            <div className="flex w-full max-w-3xl flex-col items-center justify-center rounded-[1.3rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 sm:p-6">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.title}
                  className="mb-5 h-36 w-36 rounded-[1rem] object-cover shadow-[0_18px_36px_rgba(0,0,0,0.28)] sm:h-44 sm:w-44"
                />
              ) : null}

              <iframe
                src={embed.src}
                title={item.title}
                className="h-[352px] w-full rounded-xl border-0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="rounded-[1.2rem] bg-white px-6 py-5 text-[var(--foreground)]">
              Preview unavailable.
            </div>
          )}
        </div>

        <div className="border-t border-white/8 px-4 py-4 text-white/78 sm:px-6">
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            {item.title}
          </h2>

          {item.caption ? (
            <p className="mt-2 text-sm leading-7 text-white/68 sm:text-[15px]">
              {item.caption}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function Media() {
  const [items, setItems] = useState<MediaItemData[]>([]);
  const [mediaPage, setMediaPage] = useState<MediaPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MediaItemData | null>(null);
  const [spotifyThumbs, setSpotifyThumbs] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    Promise.all([
      sanityClient.fetch<MediaItemData[]>(mediaItemsQuery),
      sanityClient.fetch<MediaPageData>(mediaPageQuery),
    ])
      .then(([itemsData, mediaPageData]) => {
        setItems(itemsData || []);
        setMediaPage(mediaPageData || null);
      })
      .catch((error) => console.error("Failed to fetch media content:", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const spotifyUrls = items
      .filter(
        (item) =>
          item.embedUrl &&
          isSpotifyUrl(item.embedUrl) &&
          !item.image &&
          !item.previewImage,
      )
      .map((item) => item.embedUrl as string);

    const uniqueSpotifyUrls = Array.from(new Set(spotifyUrls));

    if (uniqueSpotifyUrls.length === 0) return;

    let isCancelled = false;

    Promise.all(
      uniqueSpotifyUrls.map(async (url) => {
        try {
          const response = await fetch(
            `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`,
          );

          if (!response.ok) return null;

          const data = (await response.json()) as SpotifyOEmbedResponse;

          if (!data.thumbnail_url) return null;

          return [url, data.thumbnail_url] as const;
        } catch {
          return null;
        }
      }),
    ).then((results) => {
      if (isCancelled) return;

      const entries = results.filter(
        (result): result is readonly [string, string] => Boolean(result),
      );

      if (entries.length === 0) return;

      setSpotifyThumbs((prev) => {
        const next = { ...prev };

        for (const [url, thumbnail] of entries) {
          next[url] = thumbnail;
        }

        return next;
      });
    });

    return () => {
      isCancelled = true;
    };
  }, [items]);

  const sortedItems = useMemo(() => sortMediaItems(items), [items]);

  const heroBackground = useMemo(() => {
    if (mediaPage?.heroImage) {
      return urlFor(mediaPage.heroImage)
        .width(1800)
        .height(1000)
        .fit("crop")
        .url();
    }

    const featuredPreview = sortedItems.find((item) =>
      Boolean(getMediaPreviewImage(item, spotifyThumbs)),
    );

    if (featuredPreview) {
      return getMediaPreviewImage(featuredPreview, spotifyThumbs) || heroPhoto;
    }

    return heroPhoto;
  }, [mediaPage, sortedItems, spotifyThumbs]);

  return (
    <div className="bg-[var(--background)]">
      <PageHero
        kicker="Media"
        title={mediaPage?.heroTitle || "Media Archive"}
        description={
          mediaPage?.heroDescription ||
          "A compact collection of recordings, videos, photos, and embedded media."
        }
        backgroundSrc={heroBackground}
      />

      <section className="relative z-10 pt-10 pb-20 sm:pt-14 sm:pb-24">
        <div className="container-shell">
          {loading ? (
            <div className="bg-white px-6 py-8 text-[var(--muted-foreground)] shadow-[0_12px_28px_rgba(0,0,0,0.035)]">
              Loading media...
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="bg-white px-6 py-8 text-[var(--muted-foreground)] shadow-[0_12px_28px_rgba(0,0,0,0.035)]">
              {mediaPage?.emptyText || "No media available yet."}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {sortedItems.map((item) => {
                const previewImage = getMediaPreviewImage(item, spotifyThumbs);

                return (
                  <MediaTile
                    key={item._id}
                    item={item}
                    previewImage={previewImage}
                    onOpen={() => setSelectedItem(item)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {selectedItem ? (
        <MediaPreviewModal
          item={selectedItem}
          previewImage={getMediaPreviewImage(selectedItem, spotifyThumbs)}
          onClose={() => setSelectedItem(null)}
        />
      ) : null}
    </div>
  );
}

import { useEffect, useState } from "react";
import { ArrowRight, ImageIcon, Music, PlayCircle } from "lucide-react";
import { Link } from "react-router";
import heroPhoto from "../assets/ThomasHero.jpg";
import portraitPhoto from "../assets/ThomasBw.jpg";
import ButtonLink from "../components/ui/ButtonLink";
import ProjectModal from "../components/ProjectModal";
import SectionIntro from "../components/SectionIntro";
import {
  biographyQuery,
  featuredEventsQuery,
  homepageQuery,
  mediaItemsQuery,
  projectsQuery,
  siteSettingsQuery,
} from "../lib/queries";
import { sanityClient, urlFor } from "../lib/sanity";
import { scrollToHash } from "../lib/scroll";
import { resolveSiteSettings } from "../lib/siteSettings";
import type {
  BiographyData,
  EventData,
  HomepageData,
  MediaItemData,
  ProjectData,
  SiteSettingsData,
} from "../lib/types";

const fallbackTypedHeroLine =
  "Pianist - Begeleider/Muzikaal leider - Componist/Arrangeur";

function useTypewriter(text: string, typingSpeed = 55, pauseMs = 1800) {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!text) return;

    let timeoutId: number;

    if (!isDeleting && displayText.length < text.length) {
      timeoutId = window.setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && displayText.length === text.length) {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(true);
      }, pauseMs);
    } else if (isDeleting && displayText.length > 0) {
      timeoutId = window.setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length - 1));
      }, 26);
    } else if (isDeleting && displayText.length === 0) {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(false);
      }, 300);
    }

    return () => window.clearTimeout(timeoutId);
  }, [displayText, isDeleting, pauseMs, text, typingSpeed]);

  return displayText;
}

function formatDay(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
  });
}

function formatMonthShort(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    month: "short",
  });
}

function renderPortableTextContent(
  blocks?: { _type: "block"; children?: { text?: string }[] }[],
) {
  if (!blocks?.length) return null;

  return blocks.map((block, index) => {
    const text = block.children?.map((child) => child.text).join("") || "";

    if (!text.trim()) return null;

    return (
      <p
        key={index}
        className="text-[12px] leading-5 text-[var(--muted-foreground)] sm:text-sm sm:leading-6 lg:text-base lg:leading-7"
      >
        {text}
      </p>
    );
  });
}

function isUpcomingEvent(event: EventData) {
  if (event.status === "cancelled" || event.status === "past") return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDate = new Date(`${event.date}T00:00:00`);
  return eventDate >= today;
}

function getProjectHomepageVisual(project: ProjectData) {
  return project.logo || project.image || null;
}

function getHomeMediaPreviewAsset(item: MediaItemData) {
  return item.previewImage || item.image || null;
}

function HomeAgendaCard({ event }: { event: EventData }) {
  return (
    <article className="group h-full border border-[var(--border)] bg-white/92 px-2.5 py-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(36,61,120,0.08)] sm:px-5 sm:py-5 lg:px-6 lg:py-6">
      <div className="mb-2 h-[3px] w-7 bg-[var(--accent)]/85 transition-all duration-300 group-hover:w-12 sm:mb-4 sm:w-12 sm:group-hover:w-20" />

      <div className="text-3xl font-semibold leading-none text-[var(--foreground)] sm:text-[2.8rem]">
        {formatDay(event.date)}
      </div>

      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)] sm:mt-2 sm:text-xs">
        {formatMonthShort(event.date)}
      </div>

      {event.program ? (
        <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)] sm:mt-4 sm:text-[11px]">
          {event.program}
        </p>
      ) : null}

      <h3 className="mt-2 text-[0.8rem] font-semibold leading-tight text-[var(--foreground)] sm:mt-3 sm:text-[1.2rem] lg:text-[1.5rem]">
        {event.title}
      </h3>

      <div className="mt-2 space-y-0.5 text-[10px] leading-4 text-[var(--muted-foreground)] sm:mt-4 sm:space-y-1 sm:text-sm sm:leading-6">
        {[event.venue, event.city].filter(Boolean).length > 0 ? (
          <p>{[event.venue, event.city].filter(Boolean).join(" • ")}</p>
        ) : null}
        {event.time ? <p>{event.time}</p> : null}
      </div>
    </article>
  );
}

function HomeProjectCard({
  project,
  index,
  onOpen,
}: {
  project: ProjectData;
  index: number;
  onOpen: () => void;
}) {
  const cardVisual = getProjectHomepageVisual(project);
  const isLogo = Boolean(project.logo);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex min-w-0 items-center justify-center bg-transparent px-1 py-2 text-left transition-transform duration-300 hover:-translate-y-1 sm:px-4 sm:py-5 lg:px-6"
    >
      {cardVisual ? (
        <div
          className="flex w-full items-center justify-center"
          style={{
            animation: `homepageProjectFloat ${4.8 + index * 0.35}s ease-in-out infinite`,
            animationDelay: `${index * 0.16}s`,
          }}
        >
          <img
            src={urlFor(cardVisual).width(1600).fit("max").url()}
            alt={project.name}
            className={[
              "transition duration-300 group-hover:scale-[1.03]",
              isLogo
                ? "h-auto w-auto max-h-[72px] max-w-full object-contain drop-shadow-[0_14px_26px_rgba(0,0,0,0.16)] sm:max-h-[150px] lg:max-h-[190px]"
                : "h-[110px] w-full object-cover shadow-[0_16px_32px_rgba(0,0,0,0.12)] sm:h-[210px] lg:h-[240px]",
            ].join(" ")}
          />
        </div>
      ) : (
        <span
          className="text-center text-sm font-semibold text-[var(--accent)] drop-shadow-[0_10px_20px_rgba(0,0,0,0.10)] sm:text-2xl"
          style={{
            animation: `homepageProjectFloat ${4.8 + index * 0.35}s ease-in-out infinite`,
            animationDelay: `${index * 0.16}s`,
          }}
        >
          {project.name}
        </span>
      )}
    </button>
  );
}

type MediaEmbedConfig = {
  src: string;
  kind: "video" | "audio";
};

function getMediaEmbedConfig(embedUrl?: string): MediaEmbedConfig | null {
  if (!embedUrl) return null;

  try {
    const url = new URL(embedUrl);
    const host = url.hostname.replace("www.", "");

    if (host === "youtu.be" || host.endsWith("youtube.com")) {
      let id = "";

      if (host === "youtu.be") {
        id = url.pathname.replace("/", "");
      } else if (url.pathname === "/watch") {
        id = url.searchParams.get("v") || "";
      } else if (url.pathname.startsWith("/embed/")) {
        id = url.pathname.split("/embed/")[1] || "";
      } else if (url.pathname.startsWith("/shorts/")) {
        id = url.pathname.split("/shorts/")[1] || "";
      }

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
  } catch {
    return null;
  }

  return null;
}

function HomeMediaCard({ item }: { item: MediaItemData }) {
  const embed = getMediaEmbedConfig(item.embedUrl);
  const mediaPreviewAsset = getHomeMediaPreviewAsset(item);
  const imageUrl = mediaPreviewAsset
    ? urlFor(mediaPreviewAsset).width(1400).height(1050).fit("crop").url()
    : null;

  const Icon =
    item.type === "video"
      ? PlayCircle
      : item.type === "audio"
        ? Music
        : ImageIcon;

  return (
    <article className="group overflow-hidden bg-white shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(36,61,120,0.08)]">
      {imageUrl ? (
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={item.title}
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:aspect-[4/3]"
          />
          {item.type !== "image" ? (
            <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center border border-white/35 bg-black/40 text-white backdrop-blur-sm sm:bottom-3 sm:right-3 sm:h-10 sm:w-10">
              <Icon size={14} className="sm:hidden" />
              <Icon size={18} className="hidden sm:block" />
            </div>
          ) : null}
        </div>
      ) : embed?.kind === "video" ? (
        <div className="aspect-square w-full bg-black sm:aspect-[4/3]">
          <iframe
            src={embed.src}
            title={item.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : embed?.kind === "audio" ? (
        <div className="flex aspect-square items-center justify-center bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(243,240,235,0.95))] sm:aspect-[4/3]">
          <div className="flex h-10 w-10 items-center justify-center border border-[var(--border)] bg-white text-[var(--accent)] sm:h-14 sm:w-14">
            <Icon size={16} className="sm:hidden" />
            <Icon size={22} className="hidden sm:block" />
          </div>
        </div>
      ) : (
        <div className="flex aspect-square items-center justify-center bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(243,240,235,0.95))] sm:aspect-[4/3]">
          <div className="flex h-10 w-10 items-center justify-center border border-[var(--border)] bg-white text-[var(--accent)] sm:h-14 sm:w-14">
            <Icon size={16} className="sm:hidden" />
            <Icon size={22} className="hidden sm:block" />
          </div>
        </div>
      )}
    </article>
  );
}

function HeroTypedLine({ text }: { text: string }) {
  const typedText = useTypewriter(text);

  return (
    <p className="max-w-4xl text-base font-medium leading-7 text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.45)] sm:text-2xl sm:leading-10 md:text-[2rem] md:leading-[1.45]">
      {typedText}
      <span className="ml-1 inline-block h-[1em] w-[2px] translate-y-[3px] animate-pulse bg-white/90" />
    </p>
  );
}

export default function Home() {
  const [homepage, setHomepage] = useState<HomepageData | null>(null);
  const [biography, setBiography] = useState<BiographyData | null>(null);
  const [featuredEvents, setFeaturedEvents] = useState<EventData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItemData[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData | null>(
    null,
  );
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  const typedHeroSource = homepage?.heroTypedLine || fallbackTypedHeroLine;

  useEffect(() => {
    sanityClient
      .fetch<HomepageData>(homepageQuery)
      .then(setHomepage)
      .catch((error) => console.error("Failed to fetch homepage:", error));

    sanityClient
      .fetch<BiographyData>(biographyQuery)
      .then(setBiography)
      .catch((error) => console.error("Failed to fetch biography:", error));

    sanityClient
      .fetch<EventData[]>(featuredEventsQuery)
      .then((data) => setFeaturedEvents(data || []))
      .catch((error) =>
        console.error("Failed to fetch featured events:", error),
      );

    sanityClient
      .fetch<ProjectData[]>(projectsQuery)
      .then((data) => setProjects(data || []))
      .catch((error) => console.error("Failed to fetch projects:", error));

    sanityClient
      .fetch<MediaItemData[]>(mediaItemsQuery)
      .then((data) => setMediaItems(data || []))
      .catch((error) => console.error("Failed to fetch media items:", error));

    sanityClient
      .fetch<SiteSettingsData>(siteSettingsQuery)
      .then(setSiteSettings)
      .catch((error) => console.error("Failed to fetch site settings:", error));
  }, []);

  const previewProjects = projects
    .filter((project) => project.featured === true)
    .slice(0, 3);

  const homepageEvents = featuredEvents.filter(isUpcomingEvent).slice(0, 3);

  const previewMedia = mediaItems
    .filter((item) => item.featured === true)
    .slice(0, 3);

  const resolvedSiteSettings = resolveSiteSettings(siteSettings);

  const bioLead =
    biography?.shortBio ||
    homepage?.biographyTeaser ||
    "Thomas Zagers is een pianist met een verfijnde en expressieve artistieke stem, actief binnen klassieke muziek, jazz en muzikale samenwerkingen.";

  const hasPortableBio = Boolean(biography?.fullBio?.length);

  const openProjectsModal = (projectId?: string) => {
    setSelectedProjectId(
      projectId || previewProjects[0]?._id || projects[0]?._id || null,
    );
    setIsProjectsModalOpen(true);
  };

  const closeProjectsModal = () => {
    setIsProjectsModalOpen(false);
  };

  return (
    <div>
      <section
        id="home"
        className="fixed inset-0 z-0 h-screen w-full overflow-hidden"
      >
        <img
          src={
            homepage?.heroImage
              ? urlFor(homepage.heroImage)
                  .width(2200)
                  .height(1400)
                  .fit("crop")
                  .url()
              : heroPhoto
          }
          alt="Thomas Zagers performing at the piano on stage"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(5,7,14,0.78)_0%,rgba(5,7,14,0.54)_34%,rgba(5,7,14,0.26)_60%,rgba(5,7,14,0.14)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,8,14,0.28)_0%,rgba(6,8,14,0.12)_38%,rgba(6,8,14,0.03)_100%)]" />

        <div className="relative z-20 flex h-full items-center">
          <div className="container-shell w-full">
            <div className="max-w-4xl pt-16 sm:pt-20 md:pt-24">
              <div className="space-y-6 sm:space-y-8">
                <h1 className="editorial-title text-5xl font-semibold leading-[0.9] text-white [text-shadow:0_4px_28px_rgba(0,0,0,0.35)] sm:text-7xl md:text-8xl xl:text-[7.4rem]">
                  {homepage?.heroTitle || "Thomas Zagers"}
                </h1>

                <div className="min-h-[72px] sm:min-h-[84px] md:min-h-[96px]">
                  <HeroTypedLine key={typedHeroSource} text={typedHeroSource} />
                </div>

                <div className="pt-3">
                  <Link
                    to="/#bio"
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToHash("#bio");
                      window.history.replaceState(null, "", "/#bio");
                    }}
                    className="group inline-flex flex-col items-start text-white"
                  >
                    <span className="inline-flex items-center gap-2 text-[1.08rem] font-semibold tracking-[0.01em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.45)] sm:text-[1.12rem]">
                      {homepage?.heroSecondaryCtaLabel || "Lees meer"}
                      <ArrowRight
                        size={16}
                        className="translate-x-0 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>

                    <span className="mt-2 h-[2px] w-16 bg-white/80 transition-all duration-300 group-hover:w-24 group-hover:bg-white" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pointer-events-none relative z-[1] h-screen" />

      <div className="relative z-10 bg-[var(--background)]">
        <section id="bio" className="pb-20 pt-16 sm:pb-28 sm:pt-20">
          <div className="container-shell border-t border-[var(--border)] pt-12 sm:pt-16">
            <SectionIntro
              kicker="Bio"
              align="center"
              showTopLine
              kickerAsMain
            />

            <div className="mt-12 grid grid-cols-[1.12fr_0.88fr] items-start gap-4 sm:gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              <div className="min-w-0 space-y-3 sm:space-y-4 lg:space-y-5">
                <p className="text-[12px] leading-5 text-[var(--muted-foreground)] sm:text-sm sm:leading-6 lg:text-base lg:leading-7">
                  {bioLead}
                </p>

                {hasPortableBio ? (
                  <div className="space-y-3 sm:space-y-4">
                    {renderPortableTextContent(biography?.fullBio)}
                  </div>
                ) : null}
              </div>

              <div className="min-w-0">
                <div className="soft-card overflow-hidden border border-[var(--border)] bg-white/80 shadow-[0_14px_34px_rgba(0,0,0,0.05)] lg:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                  <img
                    src={
                      biography?.portrait
                        ? urlFor(biography.portrait)
                            .width(1200)
                            .height(1500)
                            .fit("crop")
                            .url()
                        : portraitPhoto
                    }
                    alt="Portrait of Thomas Zagers"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="agenda" className="pb-20 sm:pb-24">
          <div className="container-shell border-t border-[var(--border)] pt-12 sm:pt-16">
            <SectionIntro
              kicker="Agenda"
              align="center"
              showTopLine
              kickerAsMain
            />

            <div className="mt-10">
              {homepageEvents.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-5">
                  {homepageEvents.map((event) => (
                    <HomeAgendaCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="border border-[var(--border)] bg-white/80 px-6 py-8 text-center text-[var(--muted-foreground)]">
                  Nog geen uitgelichte evenementen beschikbaar.
                </div>
              )}

              <div className="flex justify-center pt-8">
                <ButtonLink to="/agenda" variant="secondary">
                  Bekijk meer
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <section id="projecten" className="pb-20 sm:pb-24">
          <div className="container-shell border-t border-[var(--border)] pt-12 sm:pt-16">
            <SectionIntro
              kicker="Projecten"
              align="center"
              showTopLine
              kickerAsMain
            />

            <div className="mt-8 sm:mt-10">
              {previewProjects.length > 0 ? (
                <div className="grid grid-cols-3 items-center gap-2 sm:gap-4 lg:gap-8">
                  {previewProjects.map((project, index) => (
                    <HomeProjectCard
                      key={project._id}
                      project={project}
                      index={index}
                      onOpen={() => openProjectsModal(project._id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="border border-[var(--border)] bg-white/80 px-6 py-8 text-center text-[var(--muted-foreground)]">
                  Nog geen uitgelichte projecten beschikbaar.
                </div>
              )}
            </div>

            <div className="flex justify-center pt-6 sm:pt-8">
              <ButtonLink
                to="/#projecten"
                variant="secondary"
                onClick={(event) => {
                  event.preventDefault();
                  openProjectsModal();
                }}
              >
                Bekijk meer
              </ButtonLink>
            </div>
          </div>
        </section>

        <section id="media" className="pb-20 sm:pb-24">
          <div className="container-shell border-t border-[var(--border)] pt-12 sm:pt-16">
            <SectionIntro
              kicker="Media"
              align="center"
              showTopLine
              kickerAsMain
            />

            <div className="mt-10">
              {previewMedia.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-5">
                  {previewMedia.map((item) => (
                    <HomeMediaCard key={item._id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="border border-[var(--border)] bg-white/80 px-6 py-8 text-center text-[var(--muted-foreground)]">
                  Nog geen media-items beschikbaar.
                </div>
              )}

              <div className="flex justify-center pt-8">
                <ButtonLink to="/media" variant="secondary">
                  Bekijk meer
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="relative isolate overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={
                resolvedSiteSettings.contactBackgroundImage
                  ? urlFor(resolvedSiteSettings.contactBackgroundImage)
                      .width(2000)
                      .height(1200)
                      .fit("crop")
                      .url()
                  : heroPhoto
              }
              alt="Thomas Zagers piano contact background"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.35)_45%,rgba(0,0,0,0.45)_100%)]" />
          </div>

          <div className="relative z-10">
            <div className="container-shell py-20 sm:py-28 lg:py-32">
              <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                <div className="mb-5 h-[6px] w-20 bg-white" />

                <p className="text-3xl font-semibold uppercase tracking-[0.16em] text-white sm:text-4xl md:text-5xl">
                  {resolvedSiteSettings.contactHeading}
                </p>

                <p className="mt-4 max-w-3xl text-base leading-8 text-white/88 sm:text-lg md:text-xl">
                  {resolvedSiteSettings.contactIntro}
                </p>

                <a
                  href={`mailto:${resolvedSiteSettings.contactEmail}`}
                  className="mt-4 !text-white text-lg font-semibold underline-offset-4 transition-opacity hover:opacity-80 hover:underline [text-shadow:0_2px_18px_rgba(0,0,0,0.45)]"
                >
                  {resolvedSiteSettings.contactEmail}
                </a>

                <a
                  href={`mailto:${resolvedSiteSettings.contactEmail}`}
                  className="mt-8 inline-flex items-center gap-3 bg-white px-7 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {resolvedSiteSettings.contactButtonLabel}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {isProjectsModalOpen ? (
        <ProjectModal
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
          onClose={closeProjectsModal}
        />
      ) : null}
    </div>
  );
}

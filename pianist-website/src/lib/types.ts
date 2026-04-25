export type SocialLinkPlatform =
  | "instagram"
  | "facebook"
  | "youtube"
  | "spotify"
  | "tiktok"
  | "linkedin"
  | "website"
  | "mail";

export type SocialLink = {
  platform: SocialLinkPlatform;
  label?: string;
  url: string;
};

export type SiteSettingsData = {
  siteTitle?: string;
  contactHeading?: string;
  contactIntro?: string;
  contactButtonLabel?: string;
  contactEmail?: string;
  contactBackgroundImage?: unknown;
  socialLinks?: SocialLink[];
  businessName?: string;
  kvkNumber?: string;
  vatNumber?: string;
  copyrightText?: string;
};

export type HomepageData = {
  heroTitle?: string;
  heroTypedLine?: string;
  heroDescription?: string;
  heroImage?: unknown;
  heroPrimaryCtaLabel?: string;
  heroSecondaryCtaLabel?: string;
  biographyTeaser?: string;
};

export type BiographyBlock = {
  _type: "block";
  children?: { text?: string }[];
};

export type BiographyData = {
  shortBio?: string;
  portrait?: unknown;
  fullBio?: BiographyBlock[];
};

export type AgendaPageData = {
  heroTitleUpcoming?: string;
  heroDescriptionUpcoming?: string;
  heroTitlePast?: string;
  heroDescriptionPast?: string;
  upcomingTabLabel?: string;
  pastTabLabel?: string;
  cancelledSectionTitle?: string;
  heroImage?: unknown;
  emptyUpcomingText?: string;
  emptyPastText?: string;
};

export type MediaPageData = {
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: unknown;
  emptyText?: string;
};

export type EventData = {
  _id: string;
  title: string;
  program?: string;
  date: string;
  time?: string;
  venue?: string;
  city?: string;
  address?: string;
  country?: string;
  ticketUrl?: string;
  detailsUrl?: string;
  featured?: boolean;
  status?: "upcoming" | "past" | "cancelled";
  notes?: string;
};

export type ProjectData = {
  _id: string;
  name: string;
  category?: string;
  role?: string;
  logo?: unknown;
  image?: unknown;
  shortDescription?: string;
  description?: string;
  featured?: boolean;
  isCurrent?: boolean;
  projectUrl?: string;
  order?: number;
};

export type MediaItemData = {
  _id: string;
  title: string;
  type: "image" | "video" | "audio";
  image?: unknown;
  previewImage?: unknown;
  embedUrl?: string;
  caption?: string;
  featured?: boolean;
  order?: number;
};

export type RepertoireItemData = {
  _id: string;
  composer: string;
  workTitle: string;
  category?: "classical" | "jazz" | "chamber-music" | "collaboration" | "other";
  duration?: string;
  notes?: string;
  order?: number;
};
import type { SiteSettingsData } from "./types";

export function resolveSiteSettings(siteSettings: SiteSettingsData | null) {
  const currentYear = new Date().getFullYear();

  return {
    siteTitle: siteSettings?.siteTitle || "Thomas Zagers",
    contactHeading: siteSettings?.contactHeading || "Contact",
    contactIntro: siteSettings?.contactIntro || "Stuur een mail naar",
    contactButtonLabel: siteSettings?.contactButtonLabel || "Neem contact",
    contactEmail: siteSettings?.contactEmail || "info@thomaszagers.nl",
    contactBackgroundImage: siteSettings?.contactBackgroundImage,
    socialLinks: siteSettings?.socialLinks || [],
    businessName: siteSettings?.businessName || "Thomas Zagers Music",
    kvkNumber: siteSettings?.kvkNumber || "",
    vatNumber: siteSettings?.vatNumber || "",
    copyrightText:
      siteSettings?.copyrightText || `Copyright © ${currentYear} Thomas Zagers`,
  };
}
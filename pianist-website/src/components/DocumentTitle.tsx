import { useEffect } from "react";
import { sanityClient } from "../lib/sanity";
import { siteSettingsQuery } from "../lib/queries";
import { resolveSiteSettings } from "../lib/siteSettings";
import type { SiteSettingsData } from "../lib/types";

export default function DocumentTitle() {
  useEffect(() => {
    let isMounted = true;

    sanityClient
      .fetch<SiteSettingsData>(siteSettingsQuery)
      .then((siteSettings) => {
        if (!isMounted) return;

        const settings = resolveSiteSettings(siteSettings);
        document.title = settings.browserTitle;
      })
      .catch((error) => {
        console.error("Failed to fetch browser title:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
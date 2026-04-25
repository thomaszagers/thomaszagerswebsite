import { useEffect, useState } from "react"
import PageHeader from "../components/PageHeader"
import { siteSettingsQuery } from "../lib/queries"
import { sanityClient } from "../lib/sanity"
import { resolveSiteSettings } from "../lib/siteSettings"
import type { SiteSettingsData } from "../lib/types"

export default function Contact() {
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sanityClient
      .fetch<SiteSettingsData>(siteSettingsQuery)
      .then((data) => setSiteSettings(data))
      .catch((error) => console.error("Failed to fetch site settings:", error))
      .finally(() => setLoading(false))
  }, [])

  const settings = resolveSiteSettings(siteSettings)

  return (
    <section className="page-section">
      <div className="container-shell space-y-10">
        <PageHeader
          kicker="Contact"
          title={settings.contactHeading || "Contact"}
          description={settings.contactIntro}
        />

        {loading ? (
          <p className="text-[var(--muted-foreground)]">Loading contact info...</p>
        ) : (
          <div className="max-w-3xl space-y-6 text-lg text-[var(--muted-foreground)] sm:text-xl">
            {settings.contactEmail ? (
              <p>
                Email:{" "}
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                >
                  {settings.contactEmail}
                </a>
              </p>
            ) : null}

            {settings.phone ? <p>Phone: {settings.phone}</p> : null}
            {settings.location ? <p>Location: {settings.location}</p> : null}

            {settings.socialLinks?.length ? (
              <div className="space-y-3 pt-2">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                  Socials
                </p>

                <div className="flex flex-wrap gap-4 text-base sm:text-lg">
                  {settings.socialLinks.map((item) => (
                    <a
                      key={`${item.platform}-${item.url}`}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                    >
                      {item.label || item.platform || item.url}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
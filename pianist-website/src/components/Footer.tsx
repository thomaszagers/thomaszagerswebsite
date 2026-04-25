import { useEffect, useState } from "react"
import { Globe, Music2 } from "lucide-react"
import { siteSettingsQuery } from "../lib/queries"
import { sanityClient } from "../lib/sanity"
import { resolveSiteSettings } from "../lib/siteSettings"
import type { SiteSettingsData, SocialLinkPlatform } from "../lib/types"

function FacebookIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6H16.7V4.8c-.3 0-.9-.1-1.8-.1-1.8 0-3.1 1.1-3.1 3.3V11H9v3h2.8v8h1.7Z" />
    </svg>
  )
}

function InstagramIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function YouTubeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.2 28.5 28.5 0 0 0 2 12a28.5 28.5 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28.5 28.5 0 0 0 22 12a28.5 28.5 0 0 0-.4-4.8Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M10 9.25 15 12l-5 2.75v-5.5Z" fill="currentColor" />
    </svg>
  )
}

function SocialIcon({
  platform,
  size = 22,
}: {
  platform?: SocialLinkPlatform
  size?: number
}) {
  switch (platform) {
    case "facebook":
      return <FacebookIcon size={size} />
    case "instagram":
      return <InstagramIcon size={size} />
    case "youtube":
      return <YouTubeIcon size={size} />
    case "spotify":
      return <Music2 size={size} strokeWidth={1.9} />
    default:
      return <Globe size={size} strokeWidth={1.9} />
  }
}

export default function Footer() {
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData | null>(null)

  useEffect(() => {
    sanityClient
      .fetch<SiteSettingsData>(siteSettingsQuery)
      .then((data) => setSiteSettings(data))
      .catch((error) => console.error("Failed to fetch site settings:", error))
  }, [])

  const settings = resolveSiteSettings(siteSettings)

  const footerMeta = [
    settings.businessName,
    settings.kvkNumber ? `KVK ${settings.kvkNumber}` : null,
    settings.vatNumber ? `BTW ${settings.vatNumber}` : null,
    settings.copyrightText,
  ].filter(Boolean)

  return (
    <footer className="relative z-10 border-t border-[var(--border)] bg-[var(--background)]">
      <div className="container-shell flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-between sm:gap-6">
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-5">
          {settings.socialLinks?.map((item) => (
            <a
              key={`${item.platform}-${item.url}`}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label || item.platform || "Social link"}
              className="inline-flex h-10 w-10 items-center justify-center border border-transparent text-[var(--foreground)] transition-colors hover:border-[var(--border)] hover:text-[var(--accent)] sm:h-11 sm:w-11"
            >
              <SocialIcon platform={item.platform} size={20} />
            </a>
          ))}
        </div>

        <div className="flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center text-xs text-[var(--muted-foreground)] sm:justify-end sm:text-sm">
          {footerMeta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}
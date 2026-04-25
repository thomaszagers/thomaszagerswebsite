type PageHeaderProps = {
  kicker: string
  title: string
  description?: string
}

export default function PageHeader({
  kicker,
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="max-w-5xl space-y-5 sm:space-y-6">
      <div className="inline-flex items-center gap-3 rounded-full bg-[var(--accent-soft)] px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)] sm:text-sm">
          {kicker}
        </span>
      </div>

      <h1 className="editorial-title text-5xl font-semibold leading-[0.92] sm:text-6xl md:text-7xl xl:text-[6rem]">
        {title}
      </h1>

      {description ? (
        <p className="max-w-3xl text-lg leading-8 text-[var(--muted-foreground)] sm:text-xl sm:leading-9">
          {description}
        </p>
      ) : null}

      <div className="h-px w-24 bg-[var(--accent)]/25" />
    </div>
  )
}
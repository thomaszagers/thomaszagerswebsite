type SectionIntroProps = {
  kicker: string;
  title?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  showTopLine?: boolean;
  kickerAsMain?: boolean;
};

export default function SectionIntro({
  kicker,
  title,
  description,
  align = "left",
  className = "",
  showTopLine = false,
  kickerAsMain = false,
}: SectionIntroProps) {
  const isCenter = align === "center";

  return (
    <div
      data-section-title
      className={[
        "space-y-5",
        isCenter ? "mx-auto text-center" : "",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "flex flex-col gap-4",
          isCenter ? "items-center" : "items-start",
        ].join(" ")}
      >
        {showTopLine ? (
          <div className="h-[6px] w-36 bg-[var(--accent)] opacity-70" />
        ) : null}

        <p className="text-3xl font-semibold uppercase tracking-[0.16em] text-[var(--foreground)] sm:text-4xl md:text-5xl">
          {kicker}
        </p>
      </div>

      {!kickerAsMain && title ? (
        <h2 className="editorial-title text-5xl font-semibold leading-[0.98] text-[var(--foreground)] sm:text-6xl md:text-7xl lg:text-[5.4rem]">
          {title}
        </h2>
      ) : null}

      {!kickerAsMain && description ? (
        <p
          className={[
            "text-lg leading-8 text-[var(--muted-foreground)]",
            isCenter ? "mx-auto max-w-2xl" : "max-w-2xl",
          ].join(" ")}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
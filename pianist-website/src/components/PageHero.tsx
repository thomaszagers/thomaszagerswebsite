type PageHeroProps = {
  title: string;
  description?: string;
  backgroundSrc: string;
};

export default function PageHero({
  title,
  description,
  backgroundSrc,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={backgroundSrc}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(7,10,17,0.78)_0%,rgba(7,10,17,0.56)_38%,rgba(7,10,17,0.34)_62%,rgba(7,10,17,0.22)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,8,14,0.48)_0%,rgba(6,8,14,0.16)_38%,rgba(6,8,14,0.18)_100%)]" />
      </div>

      <div className="relative z-10">
        <div className="container-shell flex min-h-[41vh] items-end py-20 sm:min-h-[46vh] sm:py-24 lg:min-h-[52vh] lg:py-28">
          <div className="max-w-4xl pt-16 sm:pt-20">

            <h1 className="editorial-title mt-5 text-6xl font-semibold leading-[0.92] text-white sm:text-7xl md:text-8xl xl:text-[7rem]">
              {title}
            </h1>

            {description ? (
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/82 sm:text-lg sm:leading-8 lg:text-[1.2rem]">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
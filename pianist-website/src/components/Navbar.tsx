import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { getHeaderOffset, scrollToHash } from "../lib/scroll";

const navItems = [
  { to: "/#home", hash: "#home", label: "home" },
  { to: "/#bio", hash: "#bio", label: "bio" },
  { to: "/#agenda", hash: "#agenda", label: "agenda" },
  { to: "/#projecten", hash: "#projecten", label: "projecten" },
  { to: "/#media", hash: "#media", label: "media" },
  { to: "/#contact", hash: "#contact", label: "contact" },
];

function getSectionAnchorTop(sectionId: string) {
  const section = document.getElementById(sectionId);

  if (!section) return Number.POSITIVE_INFINITY;

  const titleAnchor = section.querySelector("[data-section-title]") as
    | HTMLElement
    | null;

  const source = titleAnchor ?? section;
  return source.getBoundingClientRect().top + window.scrollY;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("#home");
  const [isHeroMode, setIsHeroMode] = useState(true);
  const location = useLocation();

  const overlayHeroPaths = new Set(["/", "/agenda", "/media"]);
  const isOverlayPage = overlayHeroPaths.has(location.pathname);

  const forcedRouteHash =
    location.pathname === "/agenda"
      ? "#agenda"
      : location.pathname === "/media"
        ? "#media"
        : null;

  const sections = useMemo(
    () =>
      navItems.map((item) => ({
        id: item.hash.replace("#", ""),
        hash: item.hash,
      })),
    [],
  );

  useEffect(() => {
    const updateHeaderState = () => {
      const scrollY = window.scrollY;

      if (!isOverlayPage) {
        setIsHeroMode(false);
        return;
      }

      if (location.pathname === "/") {
        const bioTop = getSectionAnchorTop("bio");
        const switchPoint = Math.max(bioTop - getHeaderOffset() - 120, 120);
        setIsHeroMode(scrollY < switchPoint);
        return;
      }

      setIsHeroMode(scrollY < 220);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    window.addEventListener("resize", updateHeaderState);

    return () => {
      window.removeEventListener("scroll", updateHeaderState);
      window.removeEventListener("resize", updateHeaderState);
    };
  }, [isOverlayPage, location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const updateActiveSection = () => {
      const scrollY = window.scrollY;
      const viewportBottom = scrollY + window.innerHeight;
      const documentBottom = document.documentElement.scrollHeight;

      if (viewportBottom >= documentBottom - 6) {
        setActiveHash("#contact");
        return;
      }

      const headerOffset = getHeaderOffset();
      const viewportActivationOffset =
        window.innerWidth >= 768
          ? window.innerHeight * 0.24
          : window.innerHeight * 0.18;

      const marker = scrollY + headerOffset + viewportActivationOffset;
      const bioAnchorTop = getSectionAnchorTop("bio");

      if (marker < bioAnchorTop) {
        setActiveHash((prev) => (prev === "#home" ? prev : "#home"));
        return;
      }

      let nextActive = "#home";

      for (const section of sections.filter((item) => item.id !== "home")) {
        const anchorTop = getSectionAnchorTop(section.id);

        if (marker >= anchorTop) {
          nextActive = section.hash;
        }
      }

      setActiveHash((prev) => (prev === nextActive ? prev : nextActive));
    };

    const rafId = window.requestAnimationFrame(updateActiveSection);

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [location.pathname, sections]);

  const closeMenu = () => setIsOpen(false);

  const isOverlayMode = isOverlayPage && isHeroMode;

  const headerClasses = isOverlayMode
    ? "bg-transparent"
    : "bg-[var(--background)]/92 backdrop-blur-xl";

  const brandClasses = isOverlayMode
    ? "!text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.35)]"
    : "text-[var(--foreground)]";

  const desktopLinkClasses = (isActive: boolean) =>
    [
      "relative text-[15px] font-medium lowercase transition-colors duration-200 after:absolute after:left-0 after:-bottom-1.5 after:h-[1.5px] after:w-0 after:transition-all after:duration-200 hover:after:w-full",
      isOverlayMode
        ? isActive
          ? "!text-white after:w-full after:bg-white [text-shadow:0_2px_18px_rgba(0,0,0,0.35)]"
          : "!text-white/90 hover:!text-white after:bg-white [text-shadow:0_2px_18px_rgba(0,0,0,0.35)]"
        : isActive
          ? "text-[var(--accent)] after:w-full after:bg-[var(--accent)]"
          : "text-[var(--foreground)] hover:text-[var(--accent)] after:bg-[var(--accent)]",
    ].join(" ");

  const mobileButtonClasses = isOverlayMode
    ? "border-white/30 bg-black/20 text-white hover:border-white/60 hover:bg-black/30"
    : "border-transparent bg-white/72 text-[var(--foreground)] hover:bg-white hover:text-[var(--accent)]";

  const isNavItemActive = (hash: string) => {
    if (forcedRouteHash) return hash === forcedRouteHash;
    if (location.pathname !== "/") return false;
    return activeHash === hash;
  };

  const handleNavClick =
    (hash: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      closeMenu();

      if (location.pathname === "/") {
        setActiveHash(hash);
      }

      const alreadyOnHome = location.pathname === "/";
      const sameHash =
        alreadyOnHome &&
        ((hash === "#home" &&
          (!location.hash || location.hash === "#home")) ||
          location.hash === hash);

      if (sameHash) {
        event.preventDefault();
        scrollToHash(hash);
      }
    };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${headerClasses}`}
    >
      <div className="container-shell flex min-h-[74px] items-center justify-between gap-4 md:min-h-[82px]">
        <Link
          to="/#home"
          onClick={(event) => {
            closeMenu();
            handleNavClick("#home")(event);
          }}
          className={`text-[1.45rem] leading-none tracking-[0.16em] transition-opacity hover:opacity-80 sm:text-[1.7rem] ${brandClasses}`}
        >
          <span className="font-semibold">THOMAS</span>{" "}
          <span className="font-normal opacity-95">ZAGERS</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex lg:gap-7">
          {navItems.map((item) => {
            const isActive = isNavItemActive(item.hash);

            return (
              <Link
                key={item.hash}
                to={item.to}
                onClick={handleNavClick(item.hash)}
                className={desktopLinkClasses(isActive)}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors md:hidden ${mobileButtonClasses}`}
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {isOpen && (
        <div className="bg-[var(--background)]/96 backdrop-blur-xl md:hidden">
          <div className="container-shell py-3">
            <nav className="flex flex-col gap-2 rounded-[1.5rem] bg-white/82 p-2 shadow-[0_14px_36px_rgba(0,0,0,0.06)]">
              {navItems.map((item) => {
                const isActive = isNavItemActive(item.hash);

                return (
                  <Link
                    key={item.hash}
                    to={item.to}
                    onClick={handleNavClick(item.hash)}
                    className={[
                      "rounded-[1rem] px-4 py-3 text-base font-medium lowercase transition-colors duration-200",
                      isActive
                        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "text-[var(--foreground)] hover:bg-[var(--accent-soft-2)] hover:text-[var(--accent)]",
                    ].join(" ")}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
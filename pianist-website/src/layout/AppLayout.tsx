import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { scrollToHash } from "../lib/scroll";

export default function AppLayout() {
  const location = useLocation();

  const isOverlayHeroPage =
    location.pathname === "/" ||
    location.pathname === "/agenda" ||
    location.pathname === "/media";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (location.pathname !== "/") {
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }

      if (location.hash) {
        scrollToHash(location.hash);
        return;
      }

      window.scrollTo({ top: 0, behavior: "auto" });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />
      <main className={`flex-1 ${isOverlayHeroPage ? "" : "pt-20 md:pt-24"}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
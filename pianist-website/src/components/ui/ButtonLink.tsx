import type { MouseEventHandler, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import { getHashFromTo, scrollToHash } from "../../lib/scroll";

type ButtonLinkProps = {
  to: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "text";
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export default function ButtonLink({
  to,
  children,
  variant = "primary",
  className = "",
  onClick,
}: ButtonLinkProps) {
  const location = useLocation();

  const base =
    variant === "secondary"
      ? "group inline-flex flex-col items-center justify-center text-center transition-all duration-300"
      : "inline-flex items-center justify-center text-sm font-semibold transition-all duration-200";

  const variants = {
    primary:
      "bg-[var(--accent)] px-7 py-3.5 text-white shadow-[0_10px_30px_rgba(31,44,72,0.18)] hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]",
    secondary: "text-[var(--foreground)] hover:text-[var(--accent)]",
    text: "text-[var(--accent)] hover:text-[var(--accent-hover)]",
  };

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event);

    if (event.defaultPrevented) return;

    const targetHash = getHashFromTo(to);

    if (location.pathname === "/" && targetHash) {
      event.preventDefault();
      scrollToHash(targetHash);
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={[base, variants[variant], className].join(" ")}
    >
      {variant === "secondary" ? (
        <>
          <span className="inline-flex items-center gap-2 text-[1.08rem] font-semibold tracking-[0.01em] sm:text-[1.12rem]">
            {children}
            <ArrowRight
              size={16}
              className="translate-x-0 transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
          <span className="mt-2 h-[2px] w-16 bg-[var(--accent)]/75 transition-all duration-300 group-hover:w-24 group-hover:bg-[var(--accent)]" />
        </>
      ) : (
        children
      )}
    </Link>
  );
}
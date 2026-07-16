"use client";

import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";

type AnalyticsLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  eventName: string;
  eventLabel?: string;
  target?: string;
  rel?: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function AnalyticsLink({
  children,
  className,
  eventName,
  eventLabel,
  ...rest
}: AnalyticsLinkProps) {
  function handleClick() {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, {
        event_category: "engagement",
        event_label: eventLabel,
      });
    }
  }

  return (
    <Link {...rest} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}

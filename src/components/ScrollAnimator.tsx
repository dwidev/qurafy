"use client";

import { useEffect } from "react";

/**
 * Mounts a single IntersectionObserver that watches every `.reveal` element
 * and stamps `in-view` on it when it crosses into the viewport — triggering
 * the entrance animation defined in globals.css.
 *
 * Drop this once anywhere inside <body>; it renders nothing.
 */
export default function ScrollAnimator() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target); // fire once only
          }
        });
      },
      {
        threshold: 0.12,             // trigger when 12 % visible
        rootMargin: "0px 0px -32px 0px", // subtle bottom offset
      }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

export function ScrollMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    let observer: IntersectionObserver | null = null;
    let scrollFrame = 0;
    let pointerFrame = 0;
    let maxScroll = 1;
    let pointerX = window.innerWidth * 0.72;
    let pointerY = window.innerHeight * 0.42;

    if (!reducedMotion) {
      root.classList.add("motion-ready");

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;

            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          }
        },
        {
          rootMargin: "0px 0px -10% 0px",
          threshold: 0.12,
        },
      );

      for (const target of targets) observer.observe(target);
    }

    const measurePage = () => {
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    const renderScroll = () => {
      scrollFrame = 0;
      root.style.setProperty(
        "--scroll-progress",
        String(Math.min(1, Math.max(0, window.scrollY / maxScroll))),
      );

    };

    const scheduleScroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(renderScroll);
    };

    const renderPointer = () => {
      pointerFrame = 0;
      const normalizedX = pointerX / window.innerWidth;
      const normalizedY = pointerY / window.innerHeight;

      root.style.setProperty("--pointer-x", `${normalizedX * 100}%`);
      root.style.setProperty("--pointer-y", `${normalizedY * 100}%`);
      root.style.setProperty("--hero-shift-x", `${(normalizedX - 0.5) * -18}px`);
      root.style.setProperty("--hero-shift-y", `${(normalizedY - 0.5) * -12}px`);
    };

    const schedulePointer = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (pointerFrame) return;
      pointerFrame = window.requestAnimationFrame(renderPointer);
    };

    const handleResize = () => {
      measurePage();
      scheduleScroll();
    };

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const resizeObserver = new ResizeObserver(measurePage);

    measurePage();
    renderScroll();
    resizeObserver.observe(document.body);
    window.addEventListener("scroll", scheduleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    if (!reducedMotion && finePointer) {
      renderPointer();
      window.addEventListener("pointermove", schedulePointer, { passive: true });
    }

    return () => {
      observer?.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", schedulePointer);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      root.classList.remove("motion-ready");
      root.style.removeProperty("--scroll-progress");
      root.style.removeProperty("--pointer-x");
      root.style.removeProperty("--pointer-y");
      root.style.removeProperty("--hero-shift-x");
      root.style.removeProperty("--hero-shift-y");
    };
  }, []);

  return null;
}

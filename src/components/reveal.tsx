"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "cn";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before the animation starts */
  delay?: number;
  /** Render as a specific tag instead of div */
  as?: "div" | "section" | "li" | "span";
}

/**
 * Scroll-reveal wrapper. Fades + slides content up when it enters the viewport.
 * Uses IntersectionObserver — no external animation library needed.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", visible && "is-visible", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

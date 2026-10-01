"use client";

import { useEffect, useRef } from "react";
import type { Article } from "@/lib/content/articles";
import { ArticleCard } from "@/components/site/sections";

type Card = Pick<Article, "slug" | "title" | "description" | "category" | "motif" | "readMinutes">;

/** Auto-sliding story carousel with arrows; swipeable on phones, pauses on hover/touch. */
export default function StoriesSlider({ articles }: { articles: Card[] }) {
  const track = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  const slide = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const step = ((el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 320) + 24;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    const atStart = el.scrollLeft <= 8;
    const left = dir === 1 && atEnd ? 0 : dir === -1 && atStart ? el.scrollWidth : el.scrollLeft + dir * step;
    el.scrollTo({ left, behavior: "smooth" });
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      if (!paused.current) slide(1);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const pause = () => (paused.current = true);
  const resume = () => (paused.current = false);

  return (
    <div onMouseEnter={pause} onMouseLeave={resume} onTouchStart={pause} onFocus={pause} onBlur={resume}>
      <div
        ref={track}
        className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {articles.map((a) => (
          <div key={a.slug} className="w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]">
            <ArticleCard article={a} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-3">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => slide(dir)}
            aria-label={dir === 1 ? "Next story" : "Previous story"}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-night-950"
          >
            {dir === 1 ? "→" : "←"}
          </button>
        ))}
      </div>
    </div>
  );
}

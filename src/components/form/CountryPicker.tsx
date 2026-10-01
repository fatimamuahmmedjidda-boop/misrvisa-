"use client";

import { useId, useMemo, useRef, useState } from "react";
import { COUNTRIES, flagOf } from "@/lib/content/countries";

/**
 * Searchable country / nationality picker. Visitors can type ("nig", "Nigerian",
 * "Nigeria") or scroll and choose; only values from the list are accepted.
 */
export default function CountryPicker({
  id,
  value,
  onChange,
  mode,
  required,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  mode: "nationality" | "country";
  required?: boolean;
}) {
  const listId = useId();
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const labelOf = (c: (typeof COUNTRIES)[number]) => (mode === "nationality" ? c[2] : c[1]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q === value.toLowerCase()) return COUNTRIES;
    const starts = COUNTRIES.filter((c) => c[1].toLowerCase().startsWith(q) || c[2].toLowerCase().startsWith(q));
    const contains = COUNTRIES.filter((c) => !starts.includes(c) && (c[1].toLowerCase().includes(q) || c[2].toLowerCase().includes(q)));
    return [...starts, ...contains];
  }, [query, value]);

  function choose(c: (typeof COUNTRIES)[number]) {
    const label = labelOf(c);
    onChange(label);
    setQuery(label);
    setOpen(false);
  }

  function commitOnBlur() {
    const q = query.trim().toLowerCase();
    const exact = COUNTRIES.find((c) => c[1].toLowerCase() === q || c[2].toLowerCase() === q);
    if (exact) choose(exact);
    else {
      setQuery(value);
      setOpen(false);
    }
  }

  function scrollTo(i: number) {
    listRef.current?.children[i]?.scrollIntoView({ block: "nearest" });
  }

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && results[active] ? `${listId}-${results[active][0]}` : undefined}
        autoComplete="off"
        required={required}
        placeholder={mode === "nationality" ? "Search your nationality, e.g. Nigerian" : "Search your country, e.g. Ghana"}
        value={query}
        onFocus={(e) => {
          e.target.select();
          setOpen(true);
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onBlur={commitOnBlur}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
            const next = Math.max(0, Math.min(results.length - 1, active + (e.key === "ArrowDown" ? 1 : -1)));
            setActive(next);
            scrollTo(next);
          } else if (e.key === "Enter" && open && results[active]) {
            e.preventDefault();
            choose(results[active]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        className="block w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 pr-10 text-sm text-ink placeholder:text-ink/35 focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20"
      />
      <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1.5 max-h-64 w-full overflow-auto rounded-xl border border-black/10 bg-white py-1 shadow-xl"
        >
          {results.length === 0 && <li className="px-4 py-3 text-sm text-ink/50">No match — check the spelling</li>}
          {results.map((c, i) => (
            <li
              key={c[0]}
              id={`${listId}-${c[0]}`}
              role="option"
              aria-selected={labelOf(c) === value}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(c);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm ${i === active ? "bg-emerald/10 text-emerald-dark" : "text-ink"}`}
            >
              <span aria-hidden className="text-lg leading-none">{flagOf(c[0])}</span>
              <span className="font-medium">{labelOf(c)}</span>
              {mode === "nationality" && <span className="ml-auto text-xs text-ink/45">{c[1]}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

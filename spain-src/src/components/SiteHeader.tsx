import { useEffect, useState } from "react";
import { DAYS } from "@/data";

export function SiteHeader() {
  const [hash, setHash] = useState(() => (typeof window === "undefined" ? "" : window.location.hash));

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    const current = document.querySelector('[aria-label="Jump to a day"] [aria-current="true"]');
    current?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [hash]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <a href="#top" className="font-display text-xl text-ink no-underline">
          Spain 2026
        </a>
        <nav aria-label="Sections" className="flex flex-wrap gap-x-1">
          {[
            ["#itinerary", "Days"],
            ["#stays", "Hotels"],
            ["#madrid", "Madrid"],
            ["#barcelona", "Barcelona"],
            ["#toledo", "Toledo"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="inline-flex min-h-11 items-center px-2 text-ink no-underline">
              {label}
            </a>
          ))}
        </nav>
      </div>
      <div className="max-w-full overflow-x-auto">
        <ul className="mx-auto flex w-max gap-1 px-4 pb-3" aria-label="Jump to a day">
          {DAYS.map((day) => {
            const href = `#${day.id}`;
            const current = hash === href;
            return (
              <li key={day.id}>
                <a
                  href={href}
                  aria-current={current ? "true" : undefined}
                  className={`inline-flex min-h-11 shrink-0 items-center whitespace-nowrap px-3 no-underline ${current ? "bg-ink text-paper" : "text-ink"}`}
                >
                  {day.dow} {day.date}
                  <span className={`ml-2 ${current ? "text-paper" : "text-muted"}`}>{day.city}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}

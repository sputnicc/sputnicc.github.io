import { useState } from "react";
import { PLACES, type Day } from "@/data";
import { DayMap } from "@/components/DayMap";
import { gmaps, placeIds } from "@/lib/trip";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<string, string> = {
  Booked: "bg-booked-bg text-booked",
  "To book": "bg-tobook-bg text-tobook",
  Open: "bg-open-bg text-open",
  Optional: "bg-optional-bg text-optional",
};

export function DayBlock({ day }: { day: Day }) {
  const [view, setView] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const ids = placeIds(day, view);
  const hotel = day.hotel ? PLACES[day.hotel] : null;
  const checkout = day.checkout ? PLACES[day.checkout] : null;
  const viewLabel = day.views?.[view]?.label;

  return (
    <article id={day.id} aria-labelledby={`${day.id}-title`} className="min-w-0 pb-4">
      <p className="text-sm text-muted">{day.city}</p>
      <h3 id={`${day.id}-title`} className="mt-1 text-3xl text-ink md:text-4xl">
        {day.title}
      </h3>
      <p className="mt-3 max-w-2xl text-lg">{day.summary}</p>

      {hotel ? (
        <p className="mt-4 max-w-2xl">
          Hotel tonight: {hotel.name}, {hotel.addr}.
        </p>
      ) : null}
      {checkout && !hotel ? (
        <p className="mt-4 max-w-2xl">
          Check out of {checkout.name}, {checkout.addr}.
        </p>
      ) : null}

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,42%)]">
        <div className="order-2 min-w-0 lg:order-1">
          {day.items.length === 0 ? null : (
            <ol className="divide-y divide-line border-y border-line">
              {day.items.map((item, index) => {
                const place = item.place ? PLACES[item.place] : null;
                const previous = index > 0 ? day.items[index - 1].place : null;
                const showAddress = place && item.place !== previous;
                return (
                  <li key={`${item.time}-${item.title}`} className="grid gap-1 py-3 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-4">
                    <div className="text-sm text-muted sm:pt-1">{item.time}</div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-bold">{item.title}</span>
                        {item.status ? (
                          <span className={cn("px-2 py-0.5 text-sm", STATUS_CLASS[item.status])}>{item.status}</span>
                        ) : null}
                      </div>
                      {item.note ? <p className="mt-1 text-muted">{item.note}</p> : null}
                      {showAddress ? <p className="mt-1 text-sm">{place.addr}</p> : null}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.ref ? <span className="inline-flex min-h-11 items-center text-sm">Locator {item.ref}</span> : null}
                        {place ? (
                          <button
                            type="button"
                            className="inline-flex min-h-11 items-center px-1 text-sm underline decoration-ave underline-offset-4"
                            onClick={() => {
                              setActiveId(item.place);
                              document
                                .querySelector(`#${day.id} .map-frame`)
                                ?.scrollIntoView({ block: "nearest" });
                            }}
                          >
                            Show on the map
                          </button>
                        ) : null}
                        {place ? (
                          <a
                            href={gmaps(place)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center px-1"
                          >
                            Open in Google Maps
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          {day.notes.length > 0 ? (
            <ul className="mt-4 max-w-2xl list-disc space-y-1 pl-5 text-muted">
              {day.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}
        </div>

        {ids.length > 0 ? (
          <div className="order-1 h-[22rem] min-w-0 lg:sticky lg:top-36 lg:order-2 lg:h-[calc(100vh-10rem)] lg:max-h-[40rem]">
            {day.views && day.views.length > 1 ? (
              <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label={`Map focus for ${day.date}`}>
                {day.views.map((option, index) => (
                  <button
                    key={option.label}
                    type="button"
                    className={cn(
                      "min-h-11 border px-3 text-sm",
                      index === view ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink",
                    )}
                    aria-pressed={index === view}
                    onClick={() => {
                      setView(index);
                      setActiveId(null);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
            <DayMap
              ids={ids}
              activeId={activeId}
              caption={viewLabel ? `Map: ${viewLabel}` : `Map for ${day.date}`}
              label={`Map of ${day.date}, ${day.city}`}
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}

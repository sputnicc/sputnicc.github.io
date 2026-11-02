import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { DAYS, PLACES, STAYS } from "@/data";
import { OVERVIEW_ROUTES, tripCounts } from "@/lib/trip";
import { photo, CREDITS } from "@/photos";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroParallax, type ParallaxProduct } from "@/components/aceternity/hero-parallax";
import { Timeline } from "@/components/aceternity/timeline";
import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid";
import { ContainerScroll } from "@/components/aceternity/container-scroll";
import { DayBlock } from "@/components/DayBlock";
import { DayMap } from "@/components/DayMap";
import BlurText from "@/components/react-bits/BlurText";
import DotGrid from "@/components/react-bits/DotGrid";
import { Marquee } from "@/components/magicui/marquee";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { BlurFade } from "@/components/magicui/blur-fade";

const GALLERY: ParallaxProduct[] = [
  { title: "Gran Vía", link: "#madrid", thumbnail: photo("madrid-gran-via.jpg"), alt: "Gran Vía in Madrid, the avenue in daylight" },
  { title: "Retiro", link: "#nov-23", thumbnail: photo("madrid-retiro.jpg"), alt: "The lake at Retiro Park in Madrid" },
  { title: "Royal Palace", link: "#nov-24", thumbnail: photo("madrid-palace.jpg"), alt: "Entrance to the Royal Palace of Madrid" },
  { title: "Templo de Debod", link: "#nov-25", thumbnail: photo("madrid-debod.jpg"), alt: "Templo de Debod in Madrid" },
  { title: "Sagrada Família", link: "#nov-27", thumbnail: photo("barcelona-sagrada.jpg"), alt: "The apse of the Sagrada Família in Barcelona" },
  { title: "Gothic Quarter", link: "#nov-26", thumbnail: photo("barcelona-gothic.jpg"), alt: "A street in Barcelona’s Gothic Quarter" },
  { title: "Barceloneta", link: "#nov-27", thumbnail: photo("barcelona-beach.jpg"), alt: "The beach at Barcelona" },
  { title: "Tarragona", link: "#nov-28", thumbnail: photo("tarragona-amphitheatre.jpg"), alt: "The Roman amphitheatre in Tarragona" },
  { title: "Toledo", link: "#toledo", thumbnail: photo("toledo-skyline.jpg"), alt: "Toledo seen across the river" },
  { title: "Toledo Cathedral", link: "#nov-30", thumbnail: photo("toledo-cathedral.jpg"), alt: "Toledo Cathedral reflected in a fountain" },
];

const LEGS = [
  ["Madrid", "Nov 22–25", "Hyatt Centric"],
  ["Barcelona", "Nov 26–28", "Yurbban Passage"],
  ["Tarragona", "Nov 28", "day trip, TBD"],
  ["Madrid", "Nov 29–30", "Hotel Preciados"],
  ["Toledo", "Nov 30", "day trip"],
];

const counts = tripCounts();

function days(ids: string[]) {
  return DAYS.filter((day) => ids.includes(day.id));
}

export default function App() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView();
    });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.metaKey || event.ctrlKey) return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, a, button")) return;
      const ids = DAYS.map((day) => day.id);
      const current = ids.findIndex((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        return el.getBoundingClientRect().top >= -40;
      });
      const index = current === -1 ? 0 : current;
      const next = event.key === "ArrowRight" ? Math.min(ids.length - 1, index + 1) : Math.max(0, index - 1);
      if (next === index && current !== -1) return;
      event.preventDefault();
      const id = ids[next];
      window.location.hash = id;
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#itinerary">
        Skip to the days
      </a>
      <SiteHeader />
      <main>
        <section id="top" className="relative">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[100svh]" aria-hidden="true">
            <DotGrid
              className="h-full w-full"
              baseColor="#c5ccd6"
              activeColor="#8f1d24"
              dotSize={2.5}
              gap={22}
              opacity={0.55}
              mouseInteraction
              proximity={120}
              shockStrength={2}
            />
          </div>
          <HeroParallax
            products={GALLERY}
            header={
              <div className="relative z-10 mx-auto max-w-6xl px-4 pb-8 pt-8 md:pt-14">
                <p className="text-base text-muted">Sat Nov 21 to Tue Dec 1, 2026</p>
                <BlurText
                  as="h1"
                  text="Spain, day by day."
                  className="mt-3 max-w-4xl font-display text-5xl text-ink md:text-7xl"
                  animateBy="words"
                  direction="bottom"
                  delay={50}
                  blur={6}
                  distance={18}
                  trigger="load"
                />
                <p className="mt-5 max-w-2xl text-lg">
                  Madrid, Barcelona, Tarragona and Toledo. One map and one plan for each day, with the hotel for the night, what’s booked, and what’s still open.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#nov-22" className="inline-flex min-h-11 items-center bg-ink px-4 text-paper no-underline">
                    Start with Nov 22
                  </a>
                  <a href="#itinerary" className="inline-flex min-h-11 items-center border border-ink px-4 text-ink no-underline">
                    All eleven days
                  </a>
                </div>
              </div>
            }
          />
        </section>

        <section aria-label="Route" className="border-y border-line bg-card">
          <Marquee pauseOnHover className="[--duration:48s] [--gap:2.5rem] py-4">
            {LEGS.map(([city, when, note]) => (
              <p key={`${city}-${when}`} className="flex items-baseline gap-3 whitespace-nowrap text-ink">
                <span className="font-display text-2xl">{city}</span>
                <span>{when}</span>
                <span className="text-muted">{note}</span>
              </p>
            ))}
          </Marquee>
        </section>

        <section id="stays" className="mx-auto max-w-6xl px-4 py-16" aria-labelledby="stays-title">
          <BlurFade inView>
            <h2 id="stays-title" className="text-4xl text-ink md:text-5xl">
              Three hotels
            </h2>
            <p className="mt-3 max-w-2xl text-lg">
              Four nights in Madrid, three in Barcelona, then two more nights in Madrid. Booked means the ticket or visit is already held. To book still needs a reservation. Open is time with no booking. Optional is an idea, not the plan.
            </p>
          </BlurFade>
          <BentoGrid className="mt-8">
            <Stat label="Days" value={counts.days} detail="Nov 21 to Dec 1" />
            <Stat label="Hotels" value={counts.hotels} detail="Madrid and Barcelona" />
            <Stat label="Booked" value={counts.booked} detail="Distinct trains and visits already held" />
            <Stat label="To book" value={counts.toBook} detail="Royal Palace, Bernabéu, Thanksgiving dinner, Toledo Cathedral" />
            {STAYS.map((stay) => {
              const place = PLACES[stay.pid];
              return (
                <BentoGridItem
                  key={stay.pid}
                  title={place.name}
                  description={`${stay.d}. ${stay.city}. ${stay.nights}. ${place.addr}.`}
                />
              );
            })}
            <BentoGridItem
              className="md:col-span-3"
              header={
                <div className="h-[22rem]">
                  <DayMap
                    ids={["hyatt", "yurbban", "preciados", "atocha", "sants", "tgn_stn", "toledo_stn"]}
                    routes={OVERVIEW_ROUTES}
                    caption="Hotels and the train links: Atocha to Sants, Sants to Tarragona, Atocha to Toledo."
                    label="Overview map of hotels and stations"
                  />
                </div>
              }
            />
          </BentoGrid>
        </section>

        <section id="itinerary" className="px-4 pb-20" aria-labelledby="itinerary-title">
          <div className="mx-auto max-w-6xl pb-4">
            <h2 id="itinerary-title" className="text-4xl text-ink md:text-5xl">
              Day by day
            </h2>
            <p className="mt-3 max-w-2xl">
              The map stays beside the plan on a wide screen. On a phone it sits above that day’s list. Left and right arrow keys move between days when you are not on a link or button.
            </p>
          </div>

          <Timeline data={days(["nov-21"]).map(entry)} />
          <CityBand
            id="madrid"
            title="Madrid"
            lede="Nov 22 to 25 at Hyatt Centric Gran Vía, on Gran Vía 31. Nov 29 and 30 are a second stay, at Hotel Preciados."
            file="madrid-gran-via.jpg"
            alt="Gran Vía in Madrid, the avenue in daylight"
          />
          <Timeline data={days(["nov-22", "nov-23", "nov-24", "nov-25"]).map(entry)} />
          <CityBand
            id="barcelona"
            title="Barcelona"
            lede="Nov 26 to 28 at Yurbban Passage, Carrer de Trafalgar 26. Saturday in Tarragona is still TBD with relatives."
            file="barcelona-sagrada.jpg"
            alt="The apse of the Sagrada Família in Barcelona"
          />
          <Timeline data={days(["nov-26", "nov-27", "nov-28"]).map(entry)} />
          <Timeline data={days(["nov-29"]).map(entry)} />
          <CityBand
            id="toledo"
            title="Toledo"
            lede="Monday Nov 30. Avant from Atocha at 10:15, back at 15:25, then the evening in Madrid."
            file="toledo-skyline.jpg"
            alt="Toledo seen across the river"
          />
          <Timeline data={days(["nov-30", "dec-01"]).map(entry)} />
        </section>
      </main>
      <footer className="border-t border-line px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-4 text-sm text-muted">
          <p>
            Map tiles © Esri. Place coordinates checked against OpenStreetMap (Nominatim). Restaurants and shops are intentionally left off for now; neighborhoods mark where meals will happen.
          </p>
          <p>Photographs are from Wikimedia Commons. Click a credit for the file page.</p>
          <ul className="space-y-1">
            {CREDITS.map((credit) => (
              <li key={credit.file}>
                {credit.subject}. {credit.author}, {credit.license}.{" "}
                <a href={credit.href}>File page</a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </MotionConfig>
  );
}

function entry(day: (typeof DAYS)[number]) {
  return { title: `${day.dow} ${day.date}`, content: <DayBlock day={day} /> };
}

function Stat({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <BentoGridItem
      header={
        <p className="font-display text-5xl text-ink">
          <NumberTicker value={value} startValue={value} />
        </p>
      }
      title={label}
      description={detail}
    />
  );
}

function CityBand({
  id,
  title,
  lede,
  file,
  alt,
}: {
  id: string;
  title: string;
  lede: string;
  file: string;
  alt: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-6xl">
      <ContainerScroll
        titleComponent={
          <div className="text-left">
            <h2 id={`${id}-title`} className="text-5xl text-ink md:text-6xl">
              {title}
            </h2>
            <p className="mt-3 max-w-2xl text-lg">{lede}</p>
          </div>
        }
      >
        <img src={photo(file)} alt={alt} className="h-full w-full object-cover" width={1400} height={900} />
      </ContainerScroll>
    </section>
  );
}

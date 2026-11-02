import { DAYS, PLACES, STAYS, type Day, type Place } from "@/data";

export function gmaps(place: Place) {
  return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
}

export function placeIds(day: Day, viewIndex: number): string[] {
  const view = day.views?.[viewIndex];
  if (view && view.places !== "all") {
    return view.places.filter((id) => PLACES[id]);
  }
  const ids: string[] = [];
  const add = (id?: string | null) => {
    if (id && PLACES[id] && !ids.includes(id)) ids.push(id);
  };
  add(day.hotel);
  add(day.checkout);
  for (const item of day.items) {
    add(item.place);
    item.also?.forEach(add);
  }
  return ids;
}

export function tripCounts() {
  const booked = new Set<string>();
  const toBook = new Set<string>();
  for (const day of DAYS) {
    for (const item of day.items) {
      const key = item.ref || item.place || item.title;
      if (item.status === "Booked") booked.add(key);
      if (item.status === "To book") toBook.add(key);
    }
  }
  return {
    days: DAYS.length,
    hotels: STAYS.length,
    booked: booked.size,
    toBook: toBook.size,
  };
}

export const OVERVIEW_ROUTES: [string, string][] = [
  ["atocha", "sants"],
  ["sants", "tgn_stn"],
  ["atocha", "toledo_stn"],
];

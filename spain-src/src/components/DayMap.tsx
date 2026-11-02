import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { PLACES, type Place } from "@/data";
import { gmaps } from "@/lib/trip";

const AVE = "#8f1d24";

type Props = {
  ids: string[];
  routes?: [string, string][];
  activeId?: string | null;
  caption: string;
  label: string;
};

export function DayMap({ ids, routes = [], activeId = null, caption, label }: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [failed, setFailed] = useState(false);
  const signature = `${ids.join("|")}::${routes.map((route) => route.join(">")).join("|")}`;

  useEffect(() => {
    const host = elRef.current;
    if (!host) return;
    let map: L.Map | null = null;
    let dead = false;

    const build = () => {
      if (dead || map || !elRef.current) return;
      try {
        map = L.map(elRef.current, {
          scrollWheelZoom: false,
          zoomControl: true,
        });
        mapRef.current = map;
        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
          { attribution: "Tiles © Esri", maxZoom: 18 },
        ).addTo(map);
        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
          { maxZoom: 18, pane: "overlayPane" },
        ).addTo(map);

        const bounds: L.LatLngExpression[] = [];
        const markers = new Map<string, L.Marker>();
        let placeNumber = 0;
        for (const id of ids) {
          const place = PLACES[id];
          if (!place) continue;
          if (place.kind === "area" && place.r) {
            L.circle([place.lat, place.lng], {
              radius: place.r,
              color: AVE,
              weight: 1.5,
              fillColor: AVE,
              fillOpacity: 0.08,
            })
              .addTo(map)
              .bindPopup(popupHtml(place));
            bounds.push([place.lat, place.lng]);
            continue;
          }
          const text =
            place.kind === "hotel" ? "H" : place.kind === "transit" ? "T" : String(++placeNumber);
          const marker = L.marker([place.lat, place.lng], {
            icon: L.divIcon({
              className: "",
              iconSize: [32, 32],
              iconAnchor: [16, 16],
              popupAnchor: [0, -16],
              html: `<span class="map-pin map-pin-${place.kind}">${text}</span>`,
            }),
            title: place.name,
            zIndexOffset: place.kind === "hotel" ? 500 : 0,
          })
            .addTo(map)
            .bindPopup(popupHtml(place));
          markers.set(id, marker);
          bounds.push([place.lat, place.lng]);
        }
        for (const [from, to] of routes) {
          const a = PLACES[from];
          const b = PLACES[to];
          if (!a || !b) continue;
          L.polyline(
            [
              [a.lat, a.lng],
              [b.lat, b.lng],
            ],
            { color: AVE, weight: 2, opacity: 0.8, dashArray: "6 8" },
          ).addTo(map);
        }
        markersRef.current = markers;
        if (bounds.length > 0) {
          map.fitBounds(bounds as L.LatLngBoundsExpression, { padding: [28, 28], animate: false });
        }
        window.setTimeout(() => map?.invalidateSize(), 60);
      } catch {
        if (!dead) setFailed(true);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) build();
      },
      { rootMargin: "280px" },
    );
    observer.observe(host);

    return () => {
      dead = true;
      observer.disconnect();
      map?.remove();
      mapRef.current = null;
      markersRef.current = new Map();
    };
    // signature already encodes ids and routes; depending on the arrays
    // would rebuild the map on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  useEffect(() => {
    if (!activeId) return;
    const marker = markersRef.current.get(activeId);
    const map = mapRef.current;
    if (!marker || !map) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    map.panTo(marker.getLatLng(), { animate: !reduce });
    marker.openPopup();
  }, [activeId, signature]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <p className="mb-2 text-sm text-muted">{caption}</p>
      {failed ? (
        <PlaceList ids={ids} />
      ) : (
        <div ref={elRef} className="map-frame min-h-0 flex-1" role="region" aria-label={label} />
      )}
      <p className="mt-2 text-sm text-muted">
        H is a hotel. A number is a stop. T is a station or the airport. A circle is a neighborhood.
      </p>
    </div>
  );
}

function PlaceList({ ids }: { ids: string[] }) {
  return (
    <div className="border border-line bg-card p-4">
      <p className="mb-2">The map did not start. Each place still opens in Google Maps.</p>
      <ul className="space-y-2">
        {ids.map((id) => {
          const place = PLACES[id];
          if (!place) return null;
          return (
            <li key={id}>
              <a href={gmaps(place)} target="_blank" rel="noopener noreferrer">
                {place.name}
              </a>
              <span className="text-muted"> {place.addr}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function popupHtml(place: Place) {
  return `<strong>${escapeHtml(place.name)}</strong><br/><span>${escapeHtml(place.addr)}</span><br/><a href="${gmaps(place)}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[char];
  });
}

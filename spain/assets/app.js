/* Spain · day by day — app logic. Data lives in data.js (PLACES, DAYS, STAYS). */
(function(){
"use strict";
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const gmaps = p => `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const DUR = reduceMotion ? 0 : .7;
const IDS = ["overview", ...DAYS.map(d => d.id)];

const ICONS = {
  home:(s=16)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#f3d089" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/></svg>`,
  plane:(s=15)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#fff"><path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5z"/></svg>`,
  train:(s=15)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="13" rx="3"/><path d="M5 10h14M9 20l-2 2M15 20l2 2M8.5 13.2h.01M15.5 13.2h.01"/></svg>`,
  arrow:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`
};

const hasLeaflet = typeof window.L !== "undefined";
if(!hasLeaflet) document.body.classList.add("no-leaflet");

/* ---------- Hero: stats + route strip (derived from data, nothing invented) ---------- */
(function hero(){
  const booked = new Set(), toBook = new Set();
  DAYS.forEach(d => d.items.forEach(it => {
    const key = it.ref || it.place || it.title;
    if(it.status === "Booked") booked.add(key);
    if(it.status === "To book") toBook.add(key);
  }));
  $("#stats").innerHTML = [
    ["Days", DAYS.length, "Nov 21 – Dec 1"],
    ["Hotels", STAYS.length, "Madrid · Barcelona"],
    ["Booked", booked.size, "trains & visits"],
    ["To book", toBook.size, "still open"]
  ].map(([k,v,s]) => `<div><dt>${k}</dt><dd>${v}<small>${s}</small></dd></div>`).join("");

  const legs = [
    {c:"Madrid", d:"Nov 22–25 · Hyatt Centric", id:"nov-22"},
    {c:"Barcelona", d:"Nov 26–28 · Yurbban Passage", id:"nov-26"},
    {c:"Tarragona", d:"Nov 28 · day trip, TBD", id:"nov-28", trip:true},
    {c:"Madrid", d:"Nov 29–30 · Hotel Preciados", id:"nov-29"},
    {c:"Toledo", d:"Nov 30 · day trip", id:"nov-30", trip:true}
  ];
  $("#route-strip").innerHTML = legs.map(l => `<li><button type="button" data-go="${l.id}">
      <div class="rs-line"><span class="rs-dot${l.trip?" trip":""}"></span></div>
      <div class="rs-c">${l.c}</div><div class="rs-d">${l.d}</div></button></li>`).join("");
})();
document.addEventListener("click", e => {
  const b = e.target.closest("[data-go]"); if(!b) return;
  go(b.dataset.go);
});

/* ---------- Markers ---------- */
function markerKind(place, item){
  if(place.kind==="hotel") return "hotel";
  if(place.kind==="transit") return "transit";
  if(place.kind==="area") return "area";
  const s = item?.status;
  if(s==="Booked") return "booked";
  if(s==="Optional") return "optional";
  return "planned";
}
const RANK = {booked:3, planned:2, optional:1};

function buildDay(day){
  const markers = new Map(); let n = 0;
  day.items.forEach((it, idx) => {
    [it.place, ...(it.also||[])].filter(Boolean).forEach(pid => {
      const p = PLACES[pid]; if(!p) return;
      let m = markers.get(pid);
      const kind = markerKind(p, it);
      if(!m){
        m = {pid, p, kind, items:[], num:null, hotelRole: pid===day.hotel ? "tonight" : (it.prevHotel||pid===day.checkout ? "checkout" : null)};
        if(kind==="booked"||kind==="planned"||kind==="optional") m.num = ++n;
        markers.set(pid, m);
      } else if(RANK[kind] && RANK[m.kind] && RANK[kind] > RANK[m.kind]) m.kind = kind;
      m.items.push(idx);
    });
  });
  if(day.hotel && !markers.has(day.hotel)){
    markers.set(day.hotel,{pid:day.hotel,p:PLACES[day.hotel],kind:"hotel",items:[],num:null,hotelRole:"tonight"});
  }
  return markers;
}

/* ---------- Map ---------- */
let map, layer, routeLayer, markerRefs = {}, current = null, currentMarkers = null, currentDay = null;
if(hasLeaflet){
  map = L.map("map",{zoomControl:true, scrollWheelZoom:true, zoomSnap:0.25, attributionControl:true});
  /* Esri World Light Gray — no API key. Do not switch to OSM public tiles or Carto basemaps (both block / need keys). */
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",{
    maxZoom:16,
    attribution:'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors'
  }).addTo(map);
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",{
    maxZoom:16
  }).addTo(map);
  routeLayer = L.layerGroup().addTo(map);
  layer = L.layerGroup().addTo(map);
  map.setView([40.4168,-3.7038],13);
}

function pinIcon(m, order){
  const glyph = m.kind==="hotel" ? ICONS.home() : m.kind==="transit" ? ICONS[m.p.glyph||"train"]() : (m.num ?? "");
  const size = m.kind==="optional" ? 28 : 34;
  return L.divIcon({className:"", html:`<div class="pin-in" style="--d:${Math.min(order,12)*45}ms"><div class="pin ${m.kind}" data-pid="${m.pid}"><div class="b"></div><div class="g">${glyph}</div></div></div>`,
    iconSize:[size,size], iconAnchor:[size/2, size+2], popupAnchor:[0,-size]});
}
function roleLabel(m){
  return m.kind==="hotel" ? (m.hotelRole==="tonight" ? "Hotel tonight" : m.hotelRole==="checkout" ? "Hotel · checkout" : "Hotel") :
         m.kind==="transit" ? "Transit hub" : m.kind==="area" ? "Area" :
         m.kind==="booked" ? "Booked" : m.kind==="optional" ? "Optional" : "Planned";
}
function popupHtml(m, day){
  const lines = (day ? m.items : []).map(i => { const it = day.items[i]; return `<div><b>${esc(it.time)}</b>${esc(it.title)}</div>`; }).join("");
  return `<div class="pp-k ${m.kind==="transit"?"transit":""}">${roleLabel(m)}</div>
    <div class="pp-t">${esc(m.p.name)}</div><div class="pp-a">${esc(m.p.addr)}</div>
    ${lines ? `<div class="pp-l">${lines}</div>` : ""}
    <a class="pp-g" href="${gmaps(m.p)}" target="_blank" rel="noopener">Open in Google Maps ↗</a>`;
}
const POPUP = {maxWidth:280, closeButton:true, autoPanPadding:[40,60]};

function addRoute(pts, opts){
  if(pts.length < 2) return;
  /* soft underlay + flowing dashed line on top */
  L.polyline(pts,{color:opts.color, weight:opts.weight+5, opacity:.10, lineCap:"round", lineJoin:"round", interactive:false}).addTo(routeLayer);
  L.polyline(pts,{color:opts.color, weight:opts.weight, opacity:opts.opacity, dashArray:opts.dash||"1 8", lineCap:"round", lineJoin:"round", className:"route-flow", interactive:false}).addTo(routeLayer);
}

function drawMap(day, markers){
  markerRefs = {};
  if(!hasLeaflet){ drawFallback(markers); return; }
  layer.clearLayers(); routeLayer.clearLayers();
  let order = 0;
  markers.forEach(m => {
    if(m.kind==="area"){
      const c = L.circle([m.p.lat,m.p.lng],{radius:m.p.r||350,color:"#9e620c",weight:1,opacity:.55,fillColor:"#d9952b",fillOpacity:.13,dashArray:"3 5"}).addTo(layer);
      c.bindTooltip(m.p.name,{permanent:true,direction:"center",className:"area-label"});
      c.bindPopup(popupHtml(m,day), POPUP);
      c.on("click",()=>selectPlace(m.pid,false));
      markerRefs[m.pid] = {layer:c, latlng:c.getLatLng(), area:true};
    } else {
      const mk = L.marker([m.p.lat,m.p.lng],{icon:pinIcon(m, order++), title:m.p.name, riseOnHover:true, keyboard:true,
        zIndexOffset: m.kind==="hotel"?500:(m.kind==="optional"?-100:0)}).addTo(layer);
      mk.bindPopup(popupHtml(m,day), POPUP);
      mk.on("click",()=>selectPlace(m.pid,false));
      markerRefs[m.pid] = {layer:mk, latlng:mk.getLatLng()};
    }
  });
  /* route through non-optional mapped stops, in itinerary order */
  const pts = []; let last = null;
  day.items.forEach(it => {
    if(!it.place || it.status==="Optional") return;
    const p = PLACES[it.place]; if(!p) return;
    if(it.place!==last){ pts.push([p.lat,p.lng]); last = it.place; }
  });
  addRoute(pts,{color:"#9e620c", weight:2.5, opacity:.7, dash:"1 8"});
  fitDay(day, markers);
}

function fitDay(day, markers, onlyPids){
  if(!hasLeaflet) return;
  let pts = [];
  markers.forEach(m => { if(!onlyPids || onlyPids.includes(m.pid)) pts.push([m.p.lat,m.p.lng]); });
  if(!onlyPids && day.views && day.views[0].places!=="all") pts = day.views[0].places.map(pid => [PLACES[pid].lat,PLACES[pid].lng]);
  if(!pts.length) return;
  const b = L.latLngBounds(pts);
  const small = window.innerWidth < 720;
  const pad = small ? [40,40] : [80,80];
  if(pts.length===1 || b.getNorthEast().distanceTo(b.getSouthWest()) < 250){
    map.flyTo(b.getCenter(), 15.5, {duration:DUR});
  } else {
    /* extra room at top for the caption overlay, at bottom for the legend */
    map.flyToBounds(b,{paddingTopLeft:[pad[0], pad[1] + (small?30:30)], paddingBottomRight:[pad[0], pad[1] + (small?0:40)], maxZoom:16, duration:DUR});
  }
}

function drawFallback(markers){
  const ul = $("#fallback-list"); ul.innerHTML = "";
  markers.forEach(m => ul.insertAdjacentHTML("beforeend", `<li><a href="${gmaps(m.p)}" target="_blank" rel="noopener">${esc(m.p.name)}</a> — ${esc(m.p.addr)}</li>`));
}

/* ---------- Selection sync ---------- */
function setActivePin(pid){
  $$(".pin.on").forEach(e => e.classList.remove("on"));
  if(!pid) return;
  const el = document.querySelector(`.pin[data-pid="${pid}"]`);
  if(el){ void el.offsetWidth; el.classList.add("on"); }
}
function selectPlace(pid, fromList, itemIdx){
  $$(".ti.active").forEach(e => e.classList.remove("active"));
  const m = currentMarkers && currentMarkers.get(pid);
  const idxs = itemIdx!=null ? [itemIdx] : (m ? m.items : []);
  idxs.forEach(i => { const row = document.querySelector(`.ti[data-idx="${i}"]`); row && row.classList.add("active"); });
  if(!fromList && idxs.length){
    const row = document.querySelector(`.ti[data-idx="${idxs[0]}"]`);
    row && row.scrollIntoView({behavior: reduceMotion?"auto":"smooth", block:"nearest"});
  }
  const ref = markerRefs[pid];
  if(ref && hasLeaflet){
    if(fromList){
      const z = Math.max(map.getZoom(), ref.area ? 15 : 16);
      map.flyTo(ref.latlng, z, {duration:reduceMotion?0:.55});
      setTimeout(()=>ref.layer.openPopup(), reduceMotion?0:580);
      if(window.innerWidth < 1180) $(".map-card").scrollIntoView({behavior: reduceMotion?"auto":"smooth", block:"nearest"});
    }
    setTimeout(()=>setActivePin(pid), fromList?(reduceMotion?0:600):0);
  }
}

/* ---------- Switcher ---------- */
function renderChips(){
  const wrap = $("#chips");
  const ov = `<button class="chip overview" role="tab" data-id="overview" aria-selected="false"><span class="d">Whole trip</span><span class="n">Overview</span><span class="c">3 hotels</span></button>`;
  wrap.insertAdjacentHTML("beforeend", ov + DAYS.map(d => `<button class="chip${d.thin?" thin":""}" role="tab" data-id="${d.id}" aria-selected="false">
     <span class="d">${d.dow}</span><span class="n">${d.date}</span><span class="c">${esc(d.city)}</span></button>`).join(""));
  wrap.querySelectorAll(".chip").forEach(b => b.addEventListener("click", () => go(b.dataset.id)));
}
function moveIndicator(){
  const chip = document.querySelector(`.chip[aria-selected="true"]`); const ind = $("#chip-ind");
  if(!chip) return;
  ind.style.width = chip.offsetWidth + "px";
  ind.style.transform = `translateX(${chip.offsetLeft}px)`;
  const sc = $("#chips-scroll");
  const target = chip.offsetLeft - sc.clientWidth/2 + chip.offsetWidth/2;
  sc.scrollTo({left: target, behavior: reduceMotion ? "auto" : "smooth"});
  const i = IDS.indexOf(current);
  $("#prev").disabled = i <= 0; $("#next").disabled = i >= IDS.length - 1;
}
function step(delta){
  const i = IDS.indexOf(current) + delta;
  if(i >= 0 && i < IDS.length) go(IDS[i]);
}

/* ---------- Panel render ---------- */
function statusBadge(s){ return s ? `<span class="st ${s.replace(" ","-")}">${s}</span>` : ""; }
function hotelCard(pid, label){
  const p = PLACES[pid];
  return `<button class="hotel-card" type="button" data-pid="${pid}">
     <span class="ico">${ICONS.home(18)}</span>
     <span><span class="lbl">${esc(label)}</span><span class="nm">${esc(p.name)}</span><span class="ad">${esc(p.addr)}</span></span>
     <span class="go" aria-hidden="true">${ICONS.arrow}</span></button>`;
}
function stagger(panel){
  panel.classList.remove("enter"); void panel.offsetWidth;
  [...panel.children].forEach((c,i) => c.style.setProperty("--i", i));
  panel.classList.add("enter");
}
function pager(){
  const i = IDS.indexOf(current);
  const label = id => id==="overview" ? "Overview" : (d => `${d.dow} ${d.date} · ${d.city}`)(DAYS.find(x=>x.id===id));
  const prev = i>0 ? `<button type="button" class="pv" data-step="-1"><span class="pl">← Previous</span><span class="pt">${esc(label(IDS[i-1]))}</span></button>` : `<span class="sp"></span>`;
  const next = i<IDS.length-1 ? `<button type="button" class="nx" data-step="1"><span class="pl">Next →</span><span class="pt">${esc(label(IDS[i+1]))}</span></button>` : `<span class="sp"></span>`;
  return `<div class="pager">${prev}${next}</div>`;
}
function wirePanel(panel){
  panel.querySelectorAll(".hotel-card").forEach(b => b.addEventListener("click", () => selectPlace(b.dataset.pid, true)));
  panel.querySelectorAll("[data-step]").forEach(b => b.addEventListener("click", () => step(+b.dataset.step)));
}
function moveSeg(seg){
  const on = seg.querySelector(".map-view.on"), ind = seg.querySelector(".seg-ind");
  if(!on || !ind) return;
  ind.style.width = on.offsetWidth + "px";
  ind.style.transform = `translate(${on.offsetLeft}px, ${on.offsetTop - 4}px)`;
}

function renderDay(day){
  const markers = buildDay(day); currentMarkers = markers; currentDay = day;
  const panel = $("#panel");
  let hotelHtml = "";
  if(day.hotel) hotelHtml = hotelCard(day.hotel, "Hotel tonight");
  else if(day.checkout) hotelHtml = hotelCard(day.checkout, "Checking out this morning");

  const counts = {};
  day.items.forEach(it => { if(it.status) counts[it.status] = (counts[it.status]||0) + 1; });
  const tally = Object.keys(counts).length ? `<div class="tally">${["Booked","To book","Open","Optional"].filter(k=>counts[k]).map(k =>
      `<span class="t-${k.replace(" ","").toLowerCase()}"><b>${counts[k]}</b> ${k.toLowerCase()}</span>`).join("")}</div>` : "";

  const rows = day.items.map((it, i) => {
    const p = it.place ? PLACES[it.place] : null;
    const m = it.place ? markers.get(it.place) : null;
    let kind = "note", glyph = "·";
    if(m){
      kind = m.kind==="area" ? "area" : (p.kind==="hotel" ? "hotel" : p.kind==="transit" ? "transit" : markerKind(p,it));
      glyph = p.kind==="hotel" ? ICONS.home(13) : p.kind==="transit" ? ICONS[p.glyph](13) : m.kind==="area" ? "◌" : (m.num ?? "");
    }
    const ref = it.ref ? `<span class="ref">Locator <b>${esc(it.ref)}</b></span>` : "";
    const link = p ? `<a class="gm" href="${gmaps(p)}" target="_blank" rel="noopener">Maps ↗</a>` : "";
    return `<li class="ti" tabindex="0" data-idx="${i}" ${it.place?`data-pid="${it.place}"`:""}>
      <div class="tm">${esc(it.time)}</div>
      <div class="rail"><span class="badge-dot ${kind}">${glyph}</span></div>
      <div><div class="tt">${esc(it.title)}</div>${it.note?`<div class="nt">${esc(it.note)}</div>`:""}
        <div class="meta">${statusBadge(it.status)}${ref}${link}</div></div></li>`;
  }).join("");

  const views = day.views ? `<div class="views"><span class="views-l">Map focus</span><div class="seg" role="group" aria-label="Map focus"><span class="seg-ind" aria-hidden="true"></span>${day.views.map((v,i)=>`<button type="button" class="map-view${i===0?" on":""}" data-v="${i}" aria-pressed="${i===0}">${esc(v.label)}</button>`).join("")}</div></div>` : "";
  const notes = day.notes.length ? `<div class="card notes"><h3>Notes</h3><ul>${day.notes.map(n=>`<li>${esc(n)}</li>`).join("")}</ul></div>` : "";
  const body = day.items.length
    ? `<div class="card"><h3>The day <small>${day.items.length} stop${day.items.length===1?"":"s"}</small></h3><ol class="timeline">${rows}</ol></div>`
    : `<div class="card empty"><p>Nothing to map today. The plan picks up on the ground in Madrid on Sunday morning.</p></div>`;

  panel.innerHTML = `
    <div class="day-head"><div class="when">${day.dow} · ${day.date}, 2026 · ${esc(day.city)}</div><h2>${esc(day.title)}</h2><p>${esc(day.summary)}</p>${tally}</div>
    ${hotelHtml ? `<div>${hotelHtml}</div>` : ""}
    ${views}
    ${body}
    ${notes}
    ${pager()}`;
  stagger(panel);

  panel.querySelectorAll(".ti").forEach(row => {
    const act = () => { if(row.dataset.pid) selectPlace(row.dataset.pid, true, +row.dataset.idx);
                        else { $$(".ti.active").forEach(e=>e.classList.remove("active")); row.classList.add("active"); } };
    row.addEventListener("click", e => { if(e.target.closest("a")) return; act(); });
    row.addEventListener("keydown", e => { if(e.key==="Enter"||e.key===" "){ e.preventDefault(); act(); } });
  });
  const seg = panel.querySelector(".seg");
  if(seg){
    requestAnimationFrame(() => moveSeg(seg));
    seg.querySelectorAll(".map-view").forEach(b => b.addEventListener("click", () => {
      seg.querySelectorAll(".map-view").forEach(x => { x.classList.toggle("on", x===b); x.setAttribute("aria-pressed", x===b); });
      moveSeg(seg);
      const v = day.views[+b.dataset.v].places;
      fitDay(day, markers, v==="all" ? [...markers.keys()] : v);
    }));
  }
  wirePanel(panel);

  const pinCount = markers.size;
  $("#map-caption").textContent = day.items.length ? `${day.dow} ${day.date} · ${pinCount} place${pinCount===1?"":"s"}` : `${day.dow} ${day.date} · travel day`;
  if(day.items.length || day.hotel) drawMap(day, markers);
  else if(hasLeaflet){ layer.clearLayers(); routeLayer.clearLayers(); markerRefs = {}; map.flyTo([40.4168,-3.7038], 6, {duration:DUR}); }
}

function renderOverview(){
  currentDay = null;
  const markers = new Map();
  STAYS.forEach(s => markers.set(s.pid,{pid:s.pid,p:PLACES[s.pid],kind:"hotel",items:[],hotelRole:null}));
  ["atocha","sants","tgn_stn","toledo_stn","mad"].forEach(pid => markers.set(pid,{pid,p:PLACES[pid],kind:"transit",items:[]}));
  currentMarkers = markers;
  const panel = $("#panel");
  panel.innerHTML = `
    <div class="day-head"><div class="when">Nov 21 – Dec 1, 2026 · Whole trip</div><h2>The whole trip</h2>
      <p>Three bases: central Madrid, Barcelona’s Sant Pere, then central Madrid again. Day trips to Tarragona (TBD) and Toledo. Checkout is the morning after the last night.</p></div>
    <div class="stack">${STAYS.map(s=>hotelCard(s.pid, `${s.d} · ${s.city} · ${s.nights}`)).join("")}</div>
    <div class="card"><h3>Day by day <small>${DAYS.length} days</small></h3><ul class="ov-list">${DAYS.map(d=>`<li data-id="${d.id}" tabindex="0" role="button"><span class="dt">${d.dow} ${d.date}</span><span class="tx"><b>${esc(d.city)}</b> <span>— ${esc(d.title)}</span></span><span class="ar" aria-hidden="true">→</span></li>`).join("")}</ul></div>
    ${pager()}`;
  stagger(panel);
  panel.querySelectorAll(".ov-list li").forEach(li => {
    li.addEventListener("click", () => go(li.dataset.id));
    li.addEventListener("keydown", e => { if(e.key==="Enter"||e.key===" "){ e.preventDefault(); go(li.dataset.id); } });
  });
  wirePanel(panel);
  $("#map-caption").textContent = "Whole trip · hotels and stations";
  markerRefs = {};
  if(!hasLeaflet){ drawFallback(markers); return; }
  layer.clearLayers(); routeLayer.clearLayers();
  let order = 0;
  markers.forEach(m => {
    const mk = L.marker([m.p.lat,m.p.lng],{icon:pinIcon(m, order++), title:m.p.name, zIndexOffset: m.kind==="hotel"?1000:0}).addTo(layer);
    mk.bindPopup(popupHtml(m, null), POPUP);
    markerRefs[m.pid] = {layer:mk, latlng:mk.getLatLng()};
  });
  const P = id => [PLACES[id].lat, PLACES[id].lng];
  addRoute([P("atocha"), P("sants")], {color:"#2c4f9e", weight:2, opacity:.55, dash:"4 9"});
  addRoute([P("sants"), P("tgn_stn")], {color:"#2c4f9e", weight:1.5, opacity:.35, dash:"2 8"});
  addRoute([P("atocha"), P("toledo_stn")], {color:"#2c4f9e", weight:2, opacity:.55, dash:"4 9"});
  map.flyToBounds(L.latLngBounds([...markers.values()].map(m=>[m.p.lat,m.p.lng])),{padding:[70,70],duration:DUR});
}

function revealPlanner(){
  const top = $("#planner").getBoundingClientRect().top;
  if(top > window.innerHeight * 0.45) $("#planner").scrollIntoView({behavior: reduceMotion ? "auto" : "smooth", block:"start"});
}
function go(id, push=true){
  if(!IDS.includes(id)) id = "overview";
  if(push) revealPlanner();
  current = id;
  $$(".chip").forEach(c => c.setAttribute("aria-selected", c.dataset.id===id ? "true":"false"));
  moveIndicator();
  if(id==="overview") renderOverview(); else renderDay(DAYS.find(d=>d.id===id));
  if(push) history.replaceState(null,"","#"+id);
}

/* ---------- Wiring ---------- */
$("#fit-btn").addEventListener("click", () => {
  if(current==="overview") return go("overview", false);
  if(currentDay) fitDay(currentDay, currentMarkers);
});
$("#prev").addEventListener("click", () => step(-1));
$("#next").addEventListener("click", () => step(1));
document.addEventListener("keydown", e => {
  if(e.target.closest("input,textarea,select,[contenteditable]")) return;
  if(e.altKey||e.metaKey||e.ctrlKey) return;
  if(e.key==="ArrowRight") { e.preventDefault(); step(1); }
  else if(e.key==="ArrowLeft") { e.preventDefault(); step(-1); }
});
const bar = $("#bar");
const onScroll = () => bar.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, {passive:true}); onScroll();
let rz; window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { moveIndicator(); const s=$(".seg"); s&&moveSeg(s); hasLeaflet && map.invalidateSize(); }, 120); });
if(document.fonts && document.fonts.ready) document.fonts.ready.then(() => { moveIndicator(); const s=$(".seg"); s&&moveSeg(s); });

renderChips();
const start = location.hash.slice(1);
go(IDS.includes(start) ? start : "overview", false);
/* deep link to a specific day: skip past the hero */
if(IDS.includes(start)) requestAnimationFrame(() => $("#planner").scrollIntoView({block:"start"}));
})();

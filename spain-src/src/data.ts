/* Trip data carried over verbatim from the previous site. Do not invent facts. */
export type Status = "Booked" | "To book" | "Open" | "Optional";
export type Kind = "hotel" | "transit" | "place" | "area";

export type Place = {
  name: string;
  addr: string;
  lat: number;
  lng: number;
  kind: Kind;
  glyph?: "plane" | "train";
  r?: number;
};

export type Item = {
  time: string;
  title: string;
  note: string;
  place: string | null;
  status: Status | null;
  also?: string[];
  ref?: string;
  prevHotel?: boolean;
};

export type MapView = { label: string; places: string[] | "all" };

export type Day = {
  id: string;
  dow: string;
  date: string;
  city: string;
  thin?: boolean;
  title: string;
  summary: string;
  hotel: string | null;
  checkout?: string;
  items: Item[];
  notes: string[];
  views?: MapView[];
};

export type Stay = { pid: string; d: string; city: string; nights: string };

/* Trip data — ported verbatim from v1 index.html. Coordinates from OSM/Nominatim. kind: hotel | transit | place | area */
export const PLACES: Record<string, Place> = {
  /* Hotels */
  hyatt:      {name:"Hyatt Centric Gran Vía", addr:"Gran Vía 31, Madrid", lat:40.41999, lng:-3.70373, kind:"hotel"},
  yurbban:    {name:"Yurbban Passage Hotel & Spa", addr:"Carrer de Trafalgar 26, Barcelona", lat:41.38881, lng:2.17593, kind:"hotel"},
  preciados:  {name:"Hotel Preciados", addr:"Calle Preciados 37, Madrid", lat:40.41969, lng:-3.70742, kind:"hotel"},

  /* Transit hubs */
  mad:        {name:"Madrid-Barajas Airport (MAD)", addr:"Adolfo Suárez Madrid-Barajas", lat:40.49523, lng:-3.57337, kind:"transit", glyph:"plane"},
  mad_t4s:    {name:"MAD Terminal 4S", addr:"Madrid-Barajas, Terminal 4S", lat:40.49447, lng:-3.56717, kind:"transit", glyph:"plane"},
  atocha:     {name:"Madrid Puerta de Atocha", addr:"Plaza del Emperador Carlos V, Madrid", lat:40.40660, lng:-3.68920, kind:"transit", glyph:"train"},
  sants:      {name:"Barcelona Sants", addr:"Plaça dels Països Catalans, Barcelona", lat:41.37901, lng:2.13996, kind:"transit", glyph:"train"},
  tgn_stn:    {name:"Tarragona station", addr:"Passeig d’Espanya, Tarragona", lat:41.11144, lng:1.25308, kind:"transit", glyph:"train"},
  toledo_stn: {name:"Toledo station", addr:"Paseo de la Rosa, Toledo", lat:39.86238, lng:-4.01120, kind:"transit", glyph:"train"},

  /* Madrid */
  rastro:     {name:"El Rastro", addr:"Calle de la Ribera de Curtidores, La Latina", lat:40.40863, lng:-3.70733, kind:"place"},
  cavabaja:   {name:"Calle de la Cava Baja", addr:"La Latina, Madrid", lat:40.41236, lng:-3.70925, kind:"place"},
  retiro:     {name:"Retiro Park (Estanque Grande)", addr:"Parque del Buen Retiro, Madrid", lat:40.41830, lng:-3.68370, kind:"place"},
  crystal:    {name:"Palacio de Cristal, Retiro", addr:"Parque del Buen Retiro, Madrid", lat:40.41360, lng:-3.68206, kind:"place"},
  palace:     {name:"Royal Palace of Madrid", addr:"Calle de Bailén, Madrid", lat:40.41674, lng:-3.71362, kind:"place"},
  almudena:   {name:"Almudena Cathedral", addr:"Calle de Bailén 10, Madrid", lat:40.41571, lng:-3.71459, kind:"place"},
  plazamayor: {name:"Plaza Mayor", addr:"Plaza Mayor, Madrid", lat:40.41539, lng:-3.70700, kind:"place"},
  sol:        {name:"Puerta del Sol", addr:"Puerta del Sol, Madrid", lat:40.41686, lng:-3.70388, kind:"place"},
  bernabeu:   {name:"Estadio Santiago Bernabéu", addr:"Av. de Concha Espina 1, Madrid", lat:40.45304, lng:-3.68820, kind:"place"},
  sangines:   {name:"Chocolatería San Ginés", addr:"Pasadizo de San Ginés 5, Madrid", lat:40.41677, lng:-3.70680, kind:"place"},
  botanico:   {name:"Real Jardín Botánico", addr:"Plaza de Murillo 2, Madrid", lat:40.41237, lng:-3.69215, kind:"place"},
  debod:      {name:"Templo de Debod", addr:"Calle Ferraz 1, Madrid", lat:40.42407, lng:-3.71761, kind:"place"},
  sanmiguel:  {name:"Mercado de San Miguel", addr:"Plaza de San Miguel, Madrid", lat:40.41537, lng:-3.70902, kind:"place"},
  a_solopera: {name:"Sol / Ópera", addr:"Area between Puerta del Sol and Plaza de Ópera", lat:40.41760, lng:-3.70700, kind:"area", r:330},
  a_huertas:  {name:"Huertas", addr:"Barrio de las Letras, Madrid", lat:40.41527, lng:-3.70089, kind:"area", r:300},
  a_latina:   {name:"La Latina", addr:"La Latina, Madrid", lat:40.41129, lng:-3.70831, kind:"area", r:300},

  /* Barcelona */
  bcncath:    {name:"Barcelona Cathedral · Gothic Quarter", addr:"Pla de la Seu, Barri Gòtic", lat:41.38393, lng:2.17655, kind:"place"},
  sagrada:    {name:"Sagrada Família", addr:"Carrer de Mallorca 401 · Entrance B on Carrer de Marina", lat:41.40350, lng:2.17443, kind:"place"},
  a_eixample: {name:"Eixample", addr:"Dreta de l’Eixample, Barcelona", lat:41.39250, lng:2.16550, kind:"area", r:520},
  a_sagrada:  {name:"Sagrada Família area", addr:"Around the basilica", lat:41.40350, lng:2.17443, kind:"area", r:380},
  a_barceloneta:{name:"Barceloneta", addr:"La Barceloneta, Barcelona", lat:41.38050, lng:2.18900, kind:"area", r:420},

  /* Tarragona */
  amfi:       {name:"Amfiteatre de Tarragona", addr:"Parc de l’Amfiteatre, Tarragona", lat:41.11444, lng:1.25881, kind:"place"},
  balco:      {name:"Balcó del Mediterrani", addr:"Rambla Nova, Tarragona", lat:41.11377, lng:1.25652, kind:"place"},
  tgncath:    {name:"Tarragona Cathedral", addr:"Pla de la Seu, Tarragona", lat:41.11935, lng:1.25807, kind:"place"},

  /* Toledo */
  zocodover:  {name:"Plaza de Zocodover", addr:"Toledo", lat:39.85948, lng:-4.02142, kind:"place"},
  toledocath: {name:"Toledo Cathedral", addr:"Calle Cardenal Cisneros 1, Toledo", lat:39.85691, lng:-4.02427, kind:"place"},
  santotome:  {name:"Iglesia de Santo Tomé (El Greco)", addr:"Plaza del Conde 4, Toledo", lat:39.85675, lng:-4.02820, kind:"place"}
};

/* status: "Booked" | "To book" | "Open" | "Optional" | null (no badge: arrivals, hotel moments, notes) */
export const DAYS: Day[] = [
  { id:"nov-21", dow:"Sat", date:"Nov 21", city:"Travel", thin:true,
    title:"Travel day",
    summary:"Nicolas flies overnight to Madrid. Nothing to map yet; the trip starts on the ground Sunday morning.",
    hotel:null, items:[], notes:[] },

  { id:"nov-22", dow:"Sun", date:"Nov 22", city:"Madrid",
    title:"Landing in Madrid · a soft day",
    summary:"Nicolas arrives solo. Check in, rest, and keep the day light. A few nearby ideas if energy allows.",
    hotel:"hyatt",
    items:[
      {time:"06:20", title:"Land at MAD", note:"Nicolas arrives solo.", place:"mad", status:null},
      {time:"Morning", title:"Hyatt Centric Gran Vía", note:"Drop bags / check in. Base for Nov 22–25.", place:"hyatt", status:null},
      {time:"Anytime", title:"El Rastro", note:"Sunday flea market, La Latina.", place:"rastro", status:"Optional"},
      {time:"Anytime", title:"Cava Baja", note:"Old-town street in La Latina.", place:"cavabaja", status:"Optional"},
      {time:"Anytime", title:"Retiro Park", note:"Easy walk to stretch the legs after the flight.", place:"retiro", status:"Optional"}
    ],
    notes:["Soft day. Options are ideas only: Rastro, Cava Baja, Retiro."],
    views:[{label:"Central Madrid", places:["hyatt","rastro","cavabaja","retiro"]},
           {label:"Include airport", places:"all"}] },

  { id:"nov-23", dow:"Mon", date:"Nov 23", city:"Madrid",
    title:"The family arrives",
    summary:"Airport pickup in the morning, an easy stroll in Retiro, and tapas close to the hotel in the evening.",
    hotel:"hyatt",
    items:[
      {time:"08:05", title:"Family lands at MAD T4S", note:"Meet at arrivals, Terminal 4S.", place:"mad_t4s", status:null},
      {time:"Morning", title:"Hyatt Centric Gran Vía", note:"Drop bags, freshen up.", place:"hyatt", status:null},
      {time:"~11:00", title:"Retiro · Crystal Palace & lake stroll", note:"Palacio de Cristal and the Estanque Grande.", place:"crystal", also:["retiro"], status:"Open"},
      {time:"Lunch", title:"Lunch near the park", note:"Somewhere near Retiro. Restaurant to be chosen later.", place:null, status:"Open"},
      {time:"Evening", title:"Tapas near the hotel", note:"Sol / Ópera area.", place:"a_solopera", status:"Open"}
    ],
    notes:["Lunch has no pin yet; food planning comes later."],
    views:[{label:"Central Madrid", places:["hyatt","crystal","retiro","a_solopera"]},
           {label:"Include airport", places:"all"}] },

  { id:"nov-24", dow:"Tue", date:"Nov 24", city:"Madrid",
    title:"Palace, Mass & the Bernabéu",
    summary:"Royal Palace and Almudena Cathedral side by side, a walk through Plaza Mayor and Sol, then Real Madrid vs PSV at night.",
    hotel:"hyatt",
    items:[
      {time:"Morning", title:"Royal Palace", note:"Timed-entry tickets needed.", place:"palace", status:"To book"},
      {time:"12:00", title:"Mass at Almudena Cathedral", note:"Next door to the palace.", place:"almudena", status:"Open"},
      {time:"Afternoon", title:"Plaza Mayor → Puerta del Sol walk", note:"Short walk back toward the hotel.", place:"plazamayor", also:["sol"], status:"Open"},
      {time:"21:00", title:"Real Madrid vs PSV · Santiago Bernabéu", note:"Taxi from the hotel. Tickets still needed.", place:"bernabeu", status:"To book"},
      {time:"Night", title:"Back to Hyatt Centric", note:"Taxi back.", place:"hyatt", status:null}
    ],
    notes:["Bernabéu is north of the center: about 4.5 km from the hotel, so plan a taxi each way."] },

  { id:"nov-25", dow:"Wed", date:"Nov 25", city:"Madrid",
    title:"Churros, gardens & sunset at Debod",
    summary:"Chocolate at San Ginés, the Botanical Garden, a free afternoon, Templo de Debod at golden hour, dinner in Huertas or La Latina.",
    hotel:"hyatt",
    items:[
      {time:"Morning", title:"Chocolatería San Ginés + Plaza Mayor", note:"Chocolate con churros, then the plaza around the corner.", place:"sangines", also:["plazamayor"], status:"Open"},
      {time:"Late morning", title:"Real Jardín Botánico", note:"Next to the Prado, by Retiro.", place:"botanico", status:"Open"},
      {time:"Afternoon", title:"Free afternoon", note:"Unscheduled time.", place:null, status:"Open"},
      {time:"17:00", title:"Templo de Debod", note:"17:00–17:30 slot.", place:"debod", status:"Booked"},
      {time:"Dinner", title:"Dinner · Huertas / La Latina", note:"Neighborhood only; restaurant TBD.", place:"a_huertas", also:["a_latina"], status:"Open"},
      {time:"Night", title:"Hyatt Centric Gran Vía", note:"Last night at the Hyatt. Pack for Barcelona.", place:"hyatt", status:null}
    ],
    notes:[] },

  { id:"nov-26", dow:"Thu", date:"Nov 26", city:"Madrid → Barcelona",
    title:"AVE to Barcelona · Thanksgiving",
    summary:"Morning train from Atocha, check in at Yurbban Passage, the Gothic Quarter in the afternoon, Thanksgiving dinner in Eixample.",
    hotel:"yurbban",
    items:[
      {time:"Morning", title:"Check out of Hyatt Centric", note:"Taxi to Atocha.", place:"hyatt", status:null, prevHotel:true},
      {time:"08:57", title:"AVE · Madrid Atocha → Barcelona", note:"High-speed train.", place:"atocha", status:"Booked", ref:"9STNT6"},
      {time:"12:06", title:"Arrive Barcelona Sants", note:"Taxi or metro to the hotel.", place:"sants", status:null},
      {time:"Afternoon", title:"Check in · Yurbban Passage", note:"Base for Nov 26–28.", place:"yurbban", status:null},
      {time:"Afternoon", title:"Gothic Quarter & Barcelona Cathedral", note:"Walkable from the hotel.", place:"bcncath", status:"Open"},
      {time:"Evening", title:"Thanksgiving dinner · Eixample", note:"Restaurant to be chosen and reserved.", place:"a_eixample", status:"To book"}
    ],
    notes:[],
    views:[{label:"Barcelona", places:["sants","yurbban","bcncath","a_eixample"]},
           {label:"Madrid morning", places:["hyatt","atocha"]},
           {label:"Whole route", places:"all"}] },

  { id:"nov-27", dow:"Fri", date:"Nov 27", city:"Barcelona",
    title:"Sagrada Família",
    summary:"Mass and a timed visit at Sagrada Família, Nativity tower for Nicolas & Brenda, a free afternoon, dinner by the sea in Barceloneta.",
    hotel:"yurbban",
    items:[
      {time:"10:00", title:"Mass at Sagrada Família", note:"Use Entrance B on Carrer de Marina.", place:"sagrada", status:"Booked"},
      {time:"11:00", title:"Sagrada Família timed visit", note:"Entrance B, Carrer de Marina.", place:"sagrada", status:"Booked"},
      {time:"11:30", title:"Nativity tower · Nicolas & Brenda", note:"Tower climb during the visit.", place:"sagrada", status:"Booked"},
      {time:"Lunch", title:"Lunch near Sagrada Família", note:"Around the basilica; no specific restaurant yet.", place:"sagrada", status:"Open"},
      {time:"Afternoon", title:"Free afternoon", note:"Ideas: Aquarium, CosmoCaixa, Park Güell.", place:null, status:"Optional"},
      {time:"Dinner", title:"Dinner · Barceloneta", note:"Neighborhood only; restaurant TBD.", place:"a_barceloneta", status:"Open"},
      {time:"Night", title:"Yurbban Passage", note:"", place:"yurbban", status:null}
    ],
    notes:["Afternoon ideas (Aquarium, CosmoCaixa, Park Güell) are left off the map on purpose; they’re options, not plans."] },

  { id:"nov-28", dow:"Sat", date:"Nov 28", city:"Barcelona / Tarragona",
    title:"Tarragona with relatives (TBD)",
    summary:"The day depends on plans with relatives. If it happens: train from Sants to Tarragona and a few Roman-era sights in the old town. Back to Barcelona for the night.",
    hotel:"yurbban",
    items:[
      {time:"Morning", title:"Barcelona Sants → Tarragona", note:"If going. About 1 hour south along the coast.", place:"sants", status:"Optional"},
      {time:"If going", title:"Tarragona station", note:"Short walk up to the old town.", place:"tgn_stn", status:"Optional"},
      {time:"If going", title:"Balcó del Mediterrani", note:"Sea viewpoint at the top of the Rambla Nova.", place:"balco", status:"Optional"},
      {time:"If going", title:"Amfiteatre de Tarragona", note:"Roman amphitheatre by the sea.", place:"amfi", status:"Optional"},
      {time:"If going", title:"Tarragona Cathedral", note:"Top of the Part Alta.", place:"tgncath", status:"Optional"},
      {time:"Evening", title:"Yurbban Passage", note:"Last night in Barcelona.", place:"yurbban", status:null}
    ],
    notes:["Day is TBD with relatives. Everything here is ‘if going’."],
    views:[{label:"Whole day", places:"all"},
           {label:"Tarragona old town", places:["tgn_stn","balco","amfi","tgncath"]},
           {label:"Barcelona", places:["sants","yurbban"]}] },

  { id:"nov-29", dow:"Sun", date:"Nov 29", city:"Barcelona → Madrid",
    title:"Back to Madrid",
    summary:"Morning AVE from Sants, check in at Hotel Preciados, a light afternoon, dinner close to the hotel.",
    hotel:"preciados",
    items:[
      {time:"Morning", title:"Check out of Yurbban Passage", note:"Taxi to Sants.", place:"yurbban", status:null, prevHotel:true},
      {time:"09:55", title:"AVE · Barcelona Sants → Madrid", note:"High-speed train.", place:"sants", status:"Booked", ref:"YZJXK4"},
      {time:"13:44", title:"Arrive Madrid Atocha", note:"Taxi to the hotel.", place:"atocha", status:null},
      {time:"Afternoon", title:"Check in · Hotel Preciados", note:"Base for Nov 29–30.", place:"preciados", status:null},
      {time:"Afternoon", title:"Retiro", note:"Light option.", place:"retiro", status:"Optional"},
      {time:"Afternoon", title:"Mercado de San Miguel", note:"Light option, near the hotel.", place:"sanmiguel", status:"Optional"},
      {time:"Dinner", title:"Dinner near the hotel", note:"Restaurant TBD.", place:null, status:"Open"}
    ],
    notes:[],
    views:[{label:"Madrid", places:["atocha","preciados","retiro","sanmiguel"]},
           {label:"Barcelona morning", places:["yurbban","sants"]},
           {label:"Whole route", places:"all"}] },

  { id:"nov-30", dow:"Mon", date:"Nov 30", city:"Toledo day trip",
    title:"Toledo, then Madrid at Christmas",
    summary:"Avant train to Toledo, the old town and El Greco, back mid-afternoon for Madrid’s Christmas lights and churros.",
    hotel:"preciados",
    items:[
      {time:"10:15", title:"Avant · Madrid Atocha → Toledo", note:"Return train 15:25.", place:"atocha", status:"Booked", ref:"VWJFLM"},
      {time:"Morning", title:"Arrive Toledo station", note:"Taxi or bus up to the old town.", place:"toledo_stn", status:null},
      {time:"Morning", title:"Plaza de Zocodover", note:"Main square of the old town.", place:"zocodover", status:"Open"},
      {time:"Midday", title:"Toledo Cathedral", note:"Tickets still needed.", place:"toledocath", status:"To book"},
      {time:"Midday", title:"Iglesia de Santo Tomé", note:"El Greco’s ‘Burial of the Count of Orgaz’.", place:"santotome", status:"Open"},
      {time:"15:25", title:"Avant · Toledo → Madrid Atocha", note:"Return leg.", place:"toledo_stn", status:"Booked", ref:"VWJFLM"},
      {time:"Late afternoon", title:"Retiro / Atocha stroll", note:"Retiro is a short walk from Atocha.", place:"retiro", status:"Open"},
      {time:"Evening", title:"Plaza Mayor Christmas market", note:"", place:"plazamayor", status:"Open"},
      {time:"Evening", title:"Sol → Gran Vía lights", note:"Christmas lights walk.", place:"sol", status:"Open"},
      {time:"Evening", title:"Churros at San Ginés", note:"", place:"sangines", status:"Open"},
      {time:"Night", title:"Hotel Preciados", note:"Last night in Spain.", place:"preciados", status:null}
    ],
    notes:["The map opens on Toledo. Use the map buttons to jump to the Madrid evening."],
    views:[{label:"Toledo", places:["toledo_stn","zocodover","toledocath","santotome"]},
           {label:"Madrid evening", places:["atocha","retiro","plazamayor","sol","sangines","preciados"]},
           {label:"Whole day", places:"all"}] },

  { id:"dec-01", dow:"Tue", date:"Dec 1", city:"Departure",
    title:"Heading home",
    summary:"Check out of Hotel Preciados and head to the airport. Family flies at 10:30; Nicolas on a later flight.",
    hotel:null, checkout:"preciados",
    items:[
      {time:"Early", title:"Check out · Hotel Preciados", note:"Taxi to the airport.", place:"preciados", status:null},
      {time:"10:30", title:"Family flight from MAD", note:"Plan to be at the airport well ahead.", place:"mad", status:null},
      {time:"Later", title:"Nicolas’s flight from MAD", note:"Later departure.", place:"mad", status:null}
    ],
    notes:[] }
];
export const STAYS: Stay[] = [
  {pid:"hyatt", d:"Nov 22–25", city:"Madrid", nights:"4 nights"},
  {pid:"yurbban", d:"Nov 26–28", city:"Barcelona", nights:"3 nights"},
  {pid:"preciados", d:"Nov 29–30", city:"Madrid", nights:"2 nights"}
];

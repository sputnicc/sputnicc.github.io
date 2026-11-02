export type Credit = {
  file: string;
  subject: string;
  author: string;
  license: string;
  href: string;
};

export const CREDITS: Credit[] = [
  {
    file: "madrid-gran-via.jpg",
    subject: "Gran Vía, Madrid",
    author: "Carlos Delgado",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Gran_V%C3%ADa_-_01.jpg",
  },
  {
    file: "madrid-retiro.jpg",
    subject: "Estanque del Retiro, Madrid",
    author: "Diego Delso",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Estanque_del_Retiro,_Parque_del_Retiro,_Madrid,_Espa%C3%B1a,_2017-05-18,_DD_16.jpg",
  },
  {
    file: "madrid-palace.jpg",
    subject: "Royal Palace of Madrid, entrance",
    author: "RoberRM",
    license: "CC BY 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Madrid-city-tour-royal-palace-entrance.jpg",
  },
  {
    file: "madrid-debod.jpg",
    subject: "Templo de Debod, Madrid",
    author: "Diego Delso",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Templo_de_Debod,_Madrid,_Espa%C3%B1a,_2023-01-03,_DD_89-91_HDR.jpg",
  },
  {
    file: "barcelona-sagrada.jpg",
    subject: "Sagrada Família, Barcelona",
    author: "Didier Descouens",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Barcelona_-_Exterior_of_the_Apse_of_the_Sagrada_Fam%C3%ADlia_-_Western_exposure.jpg",
  },
  {
    file: "barcelona-gothic.jpg",
    subject: "Gothic Quarter, Barcelona",
    author: "Nan Palmero",
    license: "CC BY 2.0",
    href: "https://commons.wikimedia.org/wiki/File:Barcelona_Gothic_Quarter_(53593807263).jpg",
  },
  {
    file: "barcelona-beach.jpg",
    subject: "Beach, Barcelona",
    author: "Matti Blume",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Beach,_Barcelona_(P1170713).jpg",
  },
  {
    file: "tarragona-amphitheatre.jpg",
    subject: "Amphitheatre of Tarragona",
    author: "Bernard Gagnon",
    license: "CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Amphitheatre_of_Tarragona_01.jpg",
  },
  {
    file: "toledo-skyline.jpg",
    subject: "Toledo skyline",
    author: "Diliff",
    license: "CC BY 2.5",
    href: "https://commons.wikimedia.org/wiki/File:Toledo_Skyline_Panorama,_Spain_-_Dec_2006.jpg",
  },
  {
    file: "toledo-cathedral.jpg",
    subject: "Toledo Cathedral",
    author: "J. Ligero and I. Barrios",
    license: "CC BY-SA 3.0 es",
    href: "https://commons.wikimedia.org/wiki/File:Reflejo_Catedral_de_Toledo_en_Fuente_Tres_Aguas_--_2014_--_Toledo,_Espa%C3%B1a_08.JPG",
  },
];

export function photo(file: string) {
  return `${import.meta.env.BASE_URL}photos/${file}`;
}

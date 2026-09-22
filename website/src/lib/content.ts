export const brand = {
  name: "Renaatus",
  legal: "Renaatus Projects Pvt Ltd",
  tagline: "Building foundations across borders.",
  phone: "+91 44 42654557",
  phoneHref: "tel:+914442654557",
  email: "bd@renaatus.com",
};

export { primaryNav as nav } from "@/lib/navigation";

export const company = {
  visionTitle: "Inspiring, purposeful spaces for all",
  vision:
    "To create a world where everyone has access to inspiring and purposeful spaces. Every square foot holds the power to shape dreams, build communities, and transform lives.",
  missionTitle: "Integrity, innovation, sustainability",
  mission:
    "Driven by the vision of developing one million square feet, we are committed to meaningful, accessible, high-quality spaces — ensuring every square foot we develop serves a greater purpose.",
} as const;

export const stats = [
  { value: "50+", label: "Years of construction expertise" },
  { value: "80+", label: "Projects delivered" },
  { value: "3", label: "Countries of operation" },
  { value: "3", label: "AAC plants across Tamil Nadu" },
] as const;

export const verticals = [
  {
    href: "/projects?type=infrastructure",
    title: "Infrastructure",
    kicker: "EPC",
    image: "/assets/images/verticals/infrastructure.jpg",
    copy: "From airport terminals and Supreme Court offices to industrial corridors and medical campuses, we are trusted to bring ambitious public visions to life.",
  },
  {
    href: "/projects?type=realty",
    title: "Realty",
    kicker: "Residences",
    image: "/assets/images/verticals/realty.jpg",
    copy: "A household name in the Maldives for ultra-luxury residences — timeless elegance, uncompromising quality, and homes that become landmarks.",
  },
  {
    href: "/products",
    title: "AAC Blocks",
    kicker: "Renacon",
    image: "/assets/images/verticals/aac-blocks.jpg",
    copy: "Renacon is South India’s leading brand of autoclaved aerated concrete — a new-age green wall material for faster, lighter, more sustainable building.",
  },
] as const;

export const timeline = [
  {
    year: "1970",
    title: "A construction legacy begins",
    copy: "Five decades of building expertise that still shape how we work today.",
  },
  {
    year: "1988",
    title: "RPP Construction",
    copy: "The group’s contracting roots take form.",
  },
  {
    year: "2006",
    title: "Renaatus Projects Pvt Ltd",
    copy: "A full-service EPC company is established in Chennai.",
  },
  {
    year: "2008",
    title: "RPP Ready Mix",
    copy: "Vertical integration extends into materials.",
  },
  {
    year: "2011",
    title: "First project in the Maldives",
    copy: "International delivery begins across the Indian Ocean.",
  },
  {
    year: "2012",
    title: "Renacon’s first factory, Arcot",
    copy: "AAC manufacturing starts, pairing builder and materials maker.",
  },
  {
    year: "2017",
    title: "First project in Mauritius",
    copy: "The footprint expands to a third country.",
  },
  {
    year: "2024",
    title: "Manufacturing in Saudi Arabia",
    copy: "The next chapter of global scale.",
  },
] as const;

export const pillars = [
  {
    title: "Legacy of expertise",
    points: [
      "50+ years in the construction industry",
      "Three state-of-the-art manufacturing units across Tamil Nadu",
      "Leading manufacturer of Renacon AAC blocks",
      "High standards of quality and performance",
    ],
    copy: "We combine decades of site experience with cutting-edge manufacturing to set new benchmarks in construction.",
  },
  {
    title: "Synergy in construction",
    points: [
      "Dual expertise: manufacturer and builder",
      "Efficiency and cost-effectiveness from start to finish",
      "Structural integrity at every stage",
      "Sustainable innovation in every project",
    ],
    copy: "An integrated approach lets us deliver high-quality, sustainable solutions — from materials to construction.",
  },
  {
    title: "Global footprint",
    points: [
      "Iconic projects in India, Maldives, and Mauritius",
      "Residential and commercial excellence",
      "Expanding influence in international real estate",
    ],
    copy: "Our work spans diverse markets, creating landmark buildings worldwide.",
  },
  {
    title: "Building with purpose",
    points: [
      "Innovation at the core of every project",
      "Visionary design and functional architecture",
      "Enduring landmarks with sustainable practices",
    ],
    copy: "We build more than structures. We create future-ready buildings with lasting impact.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "Renaatus Ithaa Muiy stands as a pioneer in the real estate sector in the Maldives, and I am proud that my first home purchase was with them. From the very beginning, I was impressed by their speed and quality of work.",
    name: "Yosuf",
    place: "Maldives",
    project: "Ithaa Muiy",
  },
  {
    quote:
      "Renaatus Ithaa Muiy is one of the fastest completed real estate projects in the Maldives, and the quality speaks for itself. The amenities and materials used are of top-notch standards — a truly premium living experience.",
    name: "Shiyaz",
    place: "Maldives",
    project: "Ithaa Muiy",
  },
  {
    quote:
      "Skyside by Renaatus is a perfect real estate project designed for staff housing. I was truly impressed by their timely completion and the high-quality workmanship delivered.",
    name: "Fazula",
    place: "Maldives",
    project: "Skyside",
  },
] as const;

export const leadership = [
  {
    name: "Selvasundaram",
    role: "Chairman",
    image: "/assets/images/people/selvasundaram.png",
    bio: "A pioneering leader in real estate and infrastructure. His professionalism, integrity, and commitment to learning have been instrumental in driving the Renaatus Group — navigating complex challenges and seizing strategic opportunities.",
  },
  {
    name: "Manoj Poosappan",
    role: "Managing Director",
    image: "/assets/images/people/manoj-poosappan.png",
    bio: "With degrees from College of Engineering, Guindy and University College London, Manoj drives growth in domestic and global markets. He focuses on strategic expansion, innovation, digital transformation, and Design & Build infrastructure solutions.",
  },
] as const;

export type RealtyProject = {
  name: string;
  location: string;
  image: string;
  copy: string;
  href?: string;
};

export const realtyProjects: RealtyProject[] = [
  {
    name: "Renaatus Irumathi",
    location: "Hulhumalé, Maldives",
    image: "/assets/images/realty/maldives/irumathi-exterior.png",
    href: "https://irumathi.renaatus.com/",
    copy: "Oceanfront living on the eastern shores of Hulhumalé — panoramic vistas, vertical gardens, and a sanctuary designed around well-being.",
  },
  {
    name: "Renaatus Javaahiru",
    location: "Maldives",
    image: "/assets/images/realty/maldives/javaahiru.jpg",
    href: "https://javaahiru.renaatus.com/",
    copy: "Javaahiru — “diamond” in Dhivehi — is a prestigious luxury apartment project following the sold-out success of Ithaa Muiy.",
  },
  {
    name: "Renaatus Ithaa Muiy",
    location: "Maldives",
    image: "/assets/images/realty/maldives/ithaa-muiy.jpg",
    copy: "A pioneer of premium apartments in the Maldives, completed at remarkable speed without compromising finish or amenity.",
  },
  {
    name: "The Skyside by Renaatus",
    location: "Maldives",
    image: "/assets/images/realty/maldives/skyside.jpg",
    copy: "Thoughtfully designed staff housing delivered on time — comfort, durability, and a high standard of everyday living.",
  },
  {
    name: "Vilankurichi",
    location: "Coimbatore, India",
    image: "/assets/images/realty/india/vilankurichi-coimbatore.jpg",
    copy: "Renaatus Realty’s presence in Tamil Nadu, extending a decade of residential craft beyond the islands.",
  },
] as const;

export type InfraProject = {
  name: string;
  year?: string;
  country: "India" | "Maldives" | "Mauritius";
  image: string;
  gallery?: string[];
};

export const infrastructureProjects: InfraProject[] = [
  {
    name: "Rajahmundry Domestic Airport",
    year: "2023",
    country: "India",
    image: "/assets/images/infrastructure/india/rajahmundry-airport.jpg",
    gallery: [
      "/assets/images/infrastructure/galleries/rajahmundry-airport/01.jpg",
      "/assets/images/infrastructure/galleries/rajahmundry-airport/02.jpg",
      "/assets/images/infrastructure/galleries/rajahmundry-airport/03.jpg",
      "/assets/images/infrastructure/galleries/rajahmundry-airport/04.jpg",
    ],
  },
  {
    name: "Upgradation of SH-95, Mohanur",
    year: "2023",
    country: "India",
    image: "/assets/images/infrastructure/india/sh95-mohanur.jpg",
    gallery: [
      "/assets/images/infrastructure/galleries/sh95-mohanur/01.jpg",
      "/assets/images/infrastructure/galleries/sh95-mohanur/02.jpg",
      "/assets/images/infrastructure/galleries/sh95-mohanur/03.jpg",
      "/assets/images/infrastructure/galleries/sh95-mohanur/04.jpg",
    ],
  },
  {
    name: "NIT-E, Karaikal",
    year: "2021",
    country: "India",
    image: "/assets/images/infrastructure/india/nit-karaikal.jpg",
    gallery: ["/assets/images/infrastructure/galleries/nit-karaikal/01.jpg"],
  },
  {
    name: "GA Canal irrigation infrastructure",
    year: "2021",
    country: "India",
    image: "/assets/images/infrastructure/india/ga-canal.jpg",
    gallery: [
      "/assets/images/infrastructure/galleries/ga-canal/01.jpg",
      "/assets/images/infrastructure/galleries/ga-canal/02.jpg",
      "/assets/images/infrastructure/galleries/ga-canal/03.jpg",
      "/assets/images/infrastructure/galleries/ga-canal/04.jpg",
      "/assets/images/infrastructure/galleries/ga-canal/05.jpg",
    ],
  },
  {
    name: "Tiruppur Medical College and Hospital",
    year: "2021",
    country: "India",
    image: "/assets/images/infrastructure/india/tiruppur-medical-college.jpg",
    gallery: [
      "/assets/images/infrastructure/galleries/hospital-residential/01.jpg",
      "/assets/images/infrastructure/galleries/hospital-residential/02.jpg",
      "/assets/images/infrastructure/galleries/hospital-residential/03.jpg",
      "/assets/images/infrastructure/galleries/hospital-residential/04.jpg",
    ],
  },
  {
    name: "JIPMER, Karaikal",
    year: "2020",
    country: "India",
    image: "/assets/images/infrastructure/india/jipmer-karaikal.jpg",
    gallery: [
      "/assets/images/infrastructure/galleries/jipmer-karaikal/01.jpg",
      "/assets/images/infrastructure/galleries/jipmer-karaikal/02.jpg",
      "/assets/images/infrastructure/galleries/jipmer-karaikal/03.jpg",
      "/assets/images/infrastructure/galleries/jipmer-karaikal/04.jpg",
      "/assets/images/infrastructure/galleries/jipmer-karaikal/05.jpg",
      "/assets/images/infrastructure/galleries/jipmer-karaikal/06.jpg",
    ],
  },
  {
    name: "Rajavaikal, Kumarapalayam",
    year: "2020",
    country: "India",
    image: "/assets/images/infrastructure/india/rajavaikal-kumarapalayam.jpg",
  },
  {
    name: "Mettur East Bank Canal, Salem",
    year: "2019",
    country: "India",
    image: "/assets/images/infrastructure/india/mettur-east-bank-canal.jpg",
  },
  {
    name: "Perungalathur Grade Separator",
    year: "2019",
    country: "India",
    image: "/assets/images/infrastructure/india/perungalathur-grade-separator.jpg",
  },
  {
    name: "ROB and pedestrian subway, Pollachi–Podanur",
    year: "2019",
    country: "India",
    image: "/assets/images/infrastructure/india/pollachi-podanur-rob.jpg",
  },
  {
    name: "Renaatus Social Housing",
    country: "Maldives",
    image: "/assets/images/infrastructure/maldives/social-housing.jpg",
  },
  {
    name: "GAN International Airport",
    country: "Maldives",
    image: "/assets/images/infrastructure/maldives/gan-international-airport.jpg",
  },
  {
    name: "India–Maldives Friendship Forum",
    year: "2011",
    country: "Maldives",
    image: "/assets/images/infrastructure/maldives/imff.jpg",
  },
  {
    name: "IGMH",
    year: "2013",
    country: "Maldives",
    image: "/assets/images/infrastructure/maldives/igmh.jpg",
  },
  {
    name: "Supreme Court of Mauritius",
    country: "Mauritius",
    image: "/assets/images/infrastructure/mauritius/supreme-court.jpg",
  },
];

export type Office = {
  region: string;
  role: string;
  address: string;
  email: string;
  phone?: string;
};

export const offices: Office[] = [
  {
    region: "India",
    role: "Headquarters",
    address:
      "139, VIBGYOR, 2nd Floor, Kodambakkam High Road, Nungambakkam, Chennai 600034, Tamil Nadu, India.",
    email: "bd@renaatus.com",
    phone: "+91 44 42654557",
  },
  {
    region: "Maldives",
    role: "Realty & projects",
    address:
      "Renaatus Properties (Maldives) Pvt Ltd, 1st Floor, Blue Coral, Hulhumalé. Landmark: Opp. to Fahi Plaza.",
    email: "maldives@renaatus.com",
    phone: "+960 9755777",
  },
  {
    region: "Mauritius",
    role: "Projects",
    address: "Port Louis, Mauritius.",
    email: "mauritius@renaatus.com",
  },
];

export const industries = [
  {
    title: "Aviation",
    works: "Rajahmundry Domestic Airport; GAN International Airport.",
    image: "/assets/images/infrastructure/india/rajahmundry-airport.jpg",
    featuredSlug: "rajahmundry-domestic-airport",
  },
  {
    title: "Healthcare and campuses",
    works:
      "JIPMER Karaikal; Tiruppur Medical College and Hospital; IGMH; NIT-E Karaikal.",
    image: "/assets/images/infrastructure/india/jipmer-karaikal.jpg",
    featuredSlug: "jipmer-karaikal",
  },
  {
    title: "Water and irrigation",
    works: "GA Canal; Rajavaikal, Kumarapalayam; Mettur East Bank Canal, Salem.",
    image: "/assets/images/infrastructure/india/ga-canal.jpg",
    featuredSlug: "ga-canal-irrigation-infrastructure",
  },
  {
    title: "Transport",
    works: "SH-95 Mohanur; Perungalathur Grade Separator; Pollachi–Podanur ROB.",
    image: "/assets/images/infrastructure/india/perungalathur-grade-separator.jpg",
    featuredSlug: "perungalathur-grade-separator",
  },
  {
    title: "Civic and justice",
    works: "Supreme Court of Mauritius.",
    image: "/assets/images/infrastructure/mauritius/supreme-court.jpg",
    featuredSlug: "supreme-court-of-mauritius",
  },
  {
    title: "Residential",
    works: "Maldives residences, social housing, and Vilankurichi, Coimbatore.",
    image: "/assets/images/realty/maldives/irumathi-exterior.png",
    featuredSlug: "renaatus-irumathi",
  },
] as const;

export const aacHighlights = [
  {
    title: "Green by design",
    copy: "Fly-ash based AAC that reduces load, energy use, and construction time versus conventional brick.",
  },
  {
    title: "South India’s scale",
    copy: "Three plants — Arcot, Perundurai, and Tirunelveli SIPCOT — covering the southern region.",
  },
  {
    title: "Certified quality",
    copy: "BIS-accredited, GreenPro certified, and IGBC member manufacturing with 5S Platinum discipline.",
  },
] as const;

export const founderLetter = {
  name: "Selvasundaram",
  role: "Chairman",
  image: "/assets/images/people/selvasundaram-portrait.png",
  paragraphs: [
    "We have built a strong foundation of success in 3 countries, and the time has come to take our vision to a global stage. The rapid evolution of the Indian economy, in alignment with global trends, presents immense opportunities to scale our expertise and expand our impact.",
    "With a steadfast commitment to excellence and a deep understanding of industry dynamics, we are prepared to navigate the next phase with confidence. Our experience, innovation, and resilience will drive us forward as we establish a strong international presence.",
    "The future is not just an aspiration; it is a destination we are ready to reach. Together, we move ahead with clarity, purpose, and a bold vision for global leadership in the luxury real estate vertical.",
  ],
};

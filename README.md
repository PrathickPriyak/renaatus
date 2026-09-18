# Renaatus Website

Corporate site for Renaatus Projects — infrastructure, luxury realty, and Renacon AAC blocks.

```
Renaatus-Website/
├── assets/          Brand library (source of truth)
│   ├── images/
│   ├── videos/
│   ├── logos/
│   ├── icons/
│   ├── documents/
│   └── fonts/
└── website/         Next.js (App Router, TypeScript, Tailwind)
```

## Local development

```bash
cd website
npm install
npm run dev
```

The site runs at [http://localhost:3000](http://localhost:3000). Assets sync from `/assets` into `website/public/assets` automatically.

## Pages

- `/` Home
- `/about` Vision, mission, leadership
- `/realty` Residences in Maldives and India
- `/infrastructure` EPC projects (filter by country)
- `/careers` People team
- `/contact` Offices and enquiry form

## Adding SharePoint files

The marketing OneDrive library is private. Export or download the files, then place them in the folders above using lowercase, hyphenated names. Refresh `npm run dev` to pick them up.

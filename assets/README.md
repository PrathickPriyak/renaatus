# Brand assets

Canonical media for the Renaatus website. Drop SharePoint exports into the matching folder.

```
assets/
├── images/       Photography, banners, project stills
├── videos/       Hero and loop videos
├── logos/        Wordmark and R mark
├── icons/        Patterns, UI marks
├── documents/    Brochures, decks, PDFs
└── fonts/        Licensed brand type
```

The Next.js app copies **referenced** files from this tree into `website/public/assets` on `npm run dev` and `npm run build`. Fonts, icons, documents, and unused loop videos stay local and are gitignored — do not commit the 5 GB SharePoint dump or private PDFs.

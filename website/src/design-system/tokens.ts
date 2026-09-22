/**
 * Renaatus design tokens.
 * CSS variables in globals.css are the runtime source of truth.
 * Values here document the system and drive the catalog.
 */

export const colorTokens = [
  {
    name: "Ink",
    variable: "--ink",
    value: "#07090E",
    usage: "Primary canvas. Night stone, not pure black.",
  },
  {
    name: "Ink soft",
    variable: "--ink-soft",
    value: "#0E1219",
    usage: "Alternate bands, footer, nested surfaces.",
  },
  {
    name: "Stone",
    variable: "--stone",
    value: "#161C28",
    usage: "Cards, fields, raised panels.",
  },
  {
    name: "Line",
    variable: "--line",
    value: "rgba(243, 238, 228, 0.12)",
    usage: "Hairline rules and control borders.",
  },
  {
    name: "Brand",
    variable: "--brand",
    value: "#253B78",
    usage: "R mark blue. Primary actions and focus.",
  },
  {
    name: "Brand bright",
    variable: "--brand-bright",
    value: "#314A94",
    usage: "Hover / pressed lift on brand surfaces.",
  },
  {
    name: "Cream",
    variable: "--cream",
    value: "#F3EEE4",
    usage: "Primary type on dark grounds. Wordmark white.",
  },
  {
    name: "Cream muted",
    variable: "--cream-muted",
    value: "#B7B1A6",
    usage: "Secondary body copy.",
  },
  {
    name: "Brass",
    variable: "--brass",
    value: "#C6B08A",
    usage: "Eyebrows, active nav, limestone accent. Used sparingly.",
  },
  {
    name: "Danger",
    variable: "--danger",
    value: "#C45C5C",
    usage: "Errors only. Never decorative.",
  },
] as const;

export const typeScale = [
  {
    name: "Display",
    token: "display",
    size: "clamp(2.75rem, 5.8vw, 5.25rem)",
    leading: "1.04",
    family: "Candara",
  },
  {
    name: "Heading 1",
    token: "h1",
    size: "clamp(2.25rem, 4.2vw, 3.75rem)",
    leading: "1.08",
    family: "Candara",
  },
  {
    name: "Heading 2",
    token: "h2",
    size: "clamp(1.75rem, 3vw, 2.5rem)",
    leading: "1.15",
    family: "Candara",
  },
  {
    name: "Heading 3",
    token: "h3",
    size: "clamp(1.25rem, 2vw, 1.625rem)",
    leading: "1.25",
    family: "Outfit",
  },
  {
    name: "Heading 4",
    token: "h4",
    size: "1.125rem",
    leading: "1.35",
    family: "Outfit",
  },
  {
    name: "Lead",
    token: "lead",
    size: "1.125rem",
    leading: "1.75",
    family: "Outfit",
  },
  {
    name: "Body",
    token: "body",
    size: "1rem",
    leading: "1.7",
    family: "Outfit",
  },
  {
    name: "Caption",
    token: "caption",
    size: "0.8125rem",
    leading: "1.55",
    family: "Outfit",
  },
  {
    name: "Eyebrow",
    token: "eyebrow",
    size: "0.6875rem",
    leading: "1",
    family: "Outfit",
  },
] as const;

export const spaceTokens = {
  gutter: "clamp(1.25rem, 4vw, 3rem)",
  section: "clamp(4.5rem, 9vw, 8rem)",
  container: "80rem",
  containerNarrow: "42rem",
  containerWide: "90rem",
  radius: "2px",
} as const;

import type { Metadata } from "next";
import Image from "next/image";
import { ModalDemo } from "./modal-demo";
import { pageMetadata } from "@/lib/seo/metadata";
import {
  Badge,
  Button,
  Breadcrumb,
  CtaBand,
  Card,
  CardDescription,
  CardHeader,
  CardMeta,
  CardTitle,
  Container,
  EmptyState,
  ErrorState,
  Eyebrow,
  Field,
  Heading,
  Input,
  MediaFrame,
  Reveal,
  Rule,
  Section,
  Select,
  SkeletonBlock,
  Spinner,
  Text,
  Textarea,
} from "@/design-system";
import { colorTokens, typeScale } from "@/design-system/tokens";

export const metadata: Metadata = pageMetadata({
  path: "/design-system",
  title: "Design system",
  description: "Internal Renaatus visual language — tokens and reusable components.",
  index: false,
});

export default function DesignSystemPage() {
  return (
    <div className="pt-[4.75rem]">
      <Section className="pb-10 md:pb-16">
        <Eyebrow>Renaatus</Eyebrow>
        <Heading variant="display" className="mt-5 max-w-5xl">
          A language of mass, measure, and quiet luxury.
        </Heading>
        <Rule className="mt-8" />
        <Text variant="lead" className="mt-8 max-w-2xl">
          Dark mineral grounds, the Renaatus navy from the mark, cream type, and a
          limestone brass used only as an accent. Built for civic infrastructure and
          island residences — not a residential catalogue.
        </Text>
      </Section>

      <Section
        tone="soft"
        eyebrow="Colour"
        title="Tokens from the brand"
        intro="The R mark is #253B78. Cream and brass sit on ink — never light suburbia, never rainbow gradients."
      >
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
          {colorTokens.map((token) => (
            <li key={token.variable} className="bg-ink-soft p-5">
              <div
                className="mb-5 h-16 border border-line"
                style={{ background: token.value }}
                aria-hidden
              />
              <p className="text-caption font-medium text-cream">{token.name}</p>
              <p className="mt-1 font-mono text-[0.7rem] text-cream-muted">{token.value}</p>
              <p className="mt-3 text-caption text-cream-muted">{token.usage}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="Motion"
        title="Reveal, once"
        intro="Framer Motion fades content a short distance as it enters. prefers-reduced-motion disables it."
      >
        <Reveal>
          <Text variant="lead">
            Animation is a measured lift — fourteen pixels, no bounce — then it stops.
          </Text>
        </Reveal>
      </Section>

      <Section
        eyebrow="Typography"
        title="Candara for stature. Outfit for reading."
        intro="Display and H1–H2 use the licensed Candara cuts already in the brand library. Body, captions, and UI use Outfit."
      >
        <div className="grid gap-12">
          <div>
            <Eyebrow>Display</Eyebrow>
            <Heading variant="display" className="mt-4">
              Building across water and stone.
            </Heading>
          </div>
          <div>
            <Eyebrow>Heading 1</Eyebrow>
            <Heading variant="h1" className="mt-4">
              Residences, campuses, and civic works.
            </Heading>
          </div>
          <div>
            <Eyebrow>Heading 2</Eyebrow>
            <Heading variant="h2" className="mt-4">
              Manufacturer and builder in one group.
            </Heading>
          </div>
          <div>
            <Eyebrow>Heading 3</Eyebrow>
            <Heading variant="h3" className="mt-4">
              Project, place, year — never invented pricing.
            </Heading>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Eyebrow>Lead</Eyebrow>
              <Text variant="lead" className="mt-4">
                Long sentences earn their space. Keep the measure narrow, the leading
                open, and the palette quiet.
              </Text>
            </div>
            <div>
              <Eyebrow>Body</Eyebrow>
              <Text className="mt-4">
                Body copy is Outfit at 16px / 1.7. Use muted cream for supporting
                notes. Eyebrows are brass, uppercase, widely tracked.
              </Text>
            </div>
          </div>
          <ul className="grid gap-3 border-t border-line pt-8 text-caption text-cream-muted md:grid-cols-2">
            {typeScale.map((item) => (
              <li key={item.token} className="flex justify-between gap-4">
                <span>{item.name}</span>
                <span className="font-mono">
                  {item.family} · {item.size}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="soft" eyebrow="Buttons" title="Rectilinear actions" intro="No pills. Tracking carries the corporate register; colour stays on-brand.">
        <div className="flex flex-wrap items-center gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="brass">Accent</Button>
          <Button size="sm">Small</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section eyebrow="Inputs" title="Quiet fields" intro="Hairline borders, ink infill, brass on focus. Errors use a restrained red — never decorative.">
        <div className="grid max-w-xl gap-6">
          <Field htmlFor="ds-name" label="Name">
            <Input name="name" autoComplete="name" placeholder="Full name" />
          </Field>
          <Field htmlFor="ds-email" label="Email" hint="We reply from the office you select.">
            <Input type="email" name="email" autoComplete="email" placeholder="name@company.com" />
          </Field>
          <Field htmlFor="ds-office" label="Office">
            <Select name="office" defaultValue="india">
              <option value="india">India — Chennai</option>
              <option value="maldives">Maldives — Hulhumalé</option>
              <option value="mauritius">Mauritius — Port Louis</option>
            </Select>
          </Field>
          <Field htmlFor="ds-message" label="Message">
            <Textarea name="message" rows={5} placeholder="How can we help?" />
          </Field>
          <Field htmlFor="ds-error" label="With error" error="Enter a valid email address.">
            <Input type="email" name="invalid" defaultValue="not-an-email" />
          </Field>
          <Button type="button">Submit enquiry</Button>
        </div>
      </Section>

      <Section tone="soft" eyebrow="Cards & badges" title="Place, role, material" intro="Cards are sharp-edged stone slabs. Media is full-bleed. No price, no amenity chips.">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardMeta>Infrastructure · India</CardMeta>
              <CardTitle>Rajahmundry Airport</CardTitle>
              <CardDescription>
                Civic scale, measured type, and a single brass kicker — not a property
                listing.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card variant="quiet">
            <CardHeader>
              <div className="flex flex-wrap gap-2">
                <Badge>EPC</Badge>
                <Badge variant="brass">Realty</Badge>
                <Badge variant="solid">AAC</Badge>
                <Badge variant="muted">Draft</Badge>
              </div>
              <CardTitle className="mt-4">Verticals</CardTitle>
              <CardDescription>Three group lines. No sub-brands.</CardDescription>
            </CardHeader>
          </Card>
          <Card variant="media">
            <MediaFrame className="aspect-[4/5]">
              <Image
                src="/assets/images/verticals/infrastructure.jpg"
                alt="Renaatus infrastructure photography"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <CardMeta>Maldives</CardMeta>
                <CardTitle className="mt-2">Oceanfront work</CardTitle>
              </div>
            </MediaFrame>
          </Card>
        </div>
      </Section>

      <Section eyebrow="Container & section" title="Measure and rest" intro="Default canvas is 80rem. Narrow is 42rem for reading. Sections use a large vertical rhythm.">
        <div className="grid gap-4 text-caption text-cream-muted">
          <div className="border border-line px-5 py-8">Container default — 80rem</div>
          <Container width="narrow" padded={false} className="border border-line px-5 py-8">
            Container narrow — 42rem
          </Container>
        </div>
      </Section>

      <Section
        tone="soft"
        eyebrow="Navigation"
        title="One sitemap, every chrome."
        intro="Header, footer, breadcrumbs, and the enquire band all read from website/src/lib/navigation.ts. Primary stays short; secondary lives in the mobile overlay and footer."
      >
        <Breadcrumb
          items={[
            { href: "/", label: "Home" },
            { href: "/projects", label: "Projects" },
            { href: "/projects/irumathi", label: "Irumathi" },
          ]}
        />
        <Text className="mt-8">
          Skip-to-content, a reserved header height, brass for the active route, Escape to close
          the mobile menu, and a focus loop inside it. Footer lists real offices, legal stubs, and
          the confirmed LinkedIn profile only.
        </Text>
      </Section>

      <CtaBand className="border-y" />

      <Section eyebrow="Modal" title="Interruptions, contained">
        <ModalDemo />
      </Section>

      <Section tone="soft" eyebrow="Loading" title="Wait without noise">
        <div className="grid gap-10 md:grid-cols-2">
          <Spinner />
          <SkeletonBlock />
        </div>
      </Section>

      <Section eyebrow="Error & empty" title="Honest states">
        <div className="grid gap-16 lg:grid-cols-2">
          <ErrorState
            title="This record could not be loaded."
            message="The request failed. Try again, or return to the index of work."
            action={<Button variant="secondary">Try again</Button>}
          />
          <EmptyState
            title="No projects match these filters."
            message="Clear the country or sector to see the full delivered set."
          />
        </div>
      </Section>
    </div>
  );
}

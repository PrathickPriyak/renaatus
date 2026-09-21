import Image from "next/image";
import Link from "next/link";
import {
  aacHighlights,
  founderLetter,
  news,
  pillars,
  stats,
  testimonials,
  timeline,
  verticals,
} from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <section className="relative isolate min-h-screen overflow-hidden grain">
        <video
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
          src="/assets/videos/hero-desktop.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/images/banners/infrastructure.jpg"
        />
        <video
          className="absolute inset-0 h-full w-full object-cover md:hidden"
          src="/assets/videos/hero-mobile.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/images/banners/coming-soon-mobile.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-ink" />
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-5 pb-16 pt-32 md:px-8">
          <p className="kicker fade-up">Renaatus Projects</p>
          <h1 className="font-display mt-5 max-w-5xl text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
            We build more than structures.
            <span className="block text-gold">We build futures.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/80">
            Half a century of trust across India, Maldives, and Mauritius — infrastructure, luxury residences, and green building materials.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/projects?type=realty"
              className="rounded-full bg-brand px-6 py-3 text-sm tracking-[0.14em] uppercase text-white hover:bg-brand-bright"
            >
              Explore residences
            </Link>
            <Link
              href="/projects?type=infrastructure"
              className="rounded-full border border-white/20 px-6 py-3 text-sm tracking-[0.14em] uppercase hover:border-gold hover:text-gold"
            >
              View infrastructure
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-ink-soft">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 md:px-8">
          {stats.map((item) => (
            <div key={item.label}>
              <p className="font-display text-5xl text-gold">{item.value}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div className="media-frame mx-auto aspect-[4/5] w-full max-w-md rounded-[2rem] bg-black">
          <Image
            src={founderLetter.image}
            alt={founderLetter.name}
            fill
            className="object-cover object-top"
            sizes="400px"
          />
        </div>
        <div>
          <p className="kicker">From the founder’s desk</p>
          <h2 className="font-display mt-4 text-4xl md:text-5xl">A letter from the Chairman</h2>
          <div className="mt-8 space-y-5 text-base leading-8 text-cream/80">
            {founderLetter.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-8 font-display text-xl">{founderLetter.name}</p>
          <p className="text-sm tracking-[0.16em] uppercase text-gold">{founderLetter.role}</p>
        </div>
      </section>

      <section className="bg-ink-soft py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="kicker">What we do</p>
          <h2 className="font-display mt-4 max-w-3xl text-4xl md:text-6xl">Three verticals. One standard of excellence.</h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {verticals.map((item) => (
              <Link key={item.title} href={item.href} className="group lift media-frame aspect-[3/4] rounded-3xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <p className="kicker">{item.kicker}</p>
                  <h3 className="font-display mt-2 text-3xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-cream/80">{item.copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="renacon" className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="kicker">Renacon</p>
            <h2 className="font-display mt-4 text-4xl md:text-5xl">When the manufacturer becomes the builder</h2>
            <p className="mt-6 text-base leading-8 text-cream/80">
              Renacon is South India’s leading brand of autoclaved aerated concrete — a versatile, eco-friendly wall material for schools, hospitals, workplaces, hotels, and homes.
            </p>
            <div className="mt-10 grid gap-6">
              {aacHighlights.map((item) => (
                <div key={item.title} className="border-l-2 border-gold pl-5">
                  <h3 className="font-display text-2xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["block-01", "block-02", "block-03", "block-04"].map((name) => (
              <div key={name} className="media-frame aspect-square rounded-2xl">
                <Image
                  src={`/assets/images/aac/${name}.jpg`}
                  alt="Renacon AAC blocks"
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-soft py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="kicker">Since our inception</p>
          <h2 className="font-display mt-4 text-4xl md:text-5xl">A timeline of ambition</h2>
          <ol className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {timeline.map((item) => (
              <li key={item.year} className="border-t border-gold/40 pt-6">
                <p className="font-display text-3xl text-gold">{item.year}</p>
                <h3 className="mt-3 text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <p className="kicker">How we work</p>
        <h2 className="font-display mt-4 text-4xl md:text-5xl">Built on purpose</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {pillars.map((item) => (
            <article key={item.title} className="rounded-3xl border border-white/10 bg-panel p-8">
              <h3 className="font-display text-3xl">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted">{item.copy}</p>
              <ul className="mt-6 space-y-2 text-sm text-cream/85">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ink-soft py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="kicker">Happy homeowners</p>
          <h2 className="font-display mt-4 max-w-3xl text-4xl md:text-5xl">
            Client satisfaction is the true measure of our success.
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote key={item.name} className="rounded-3xl border border-white/10 bg-ink p-8">
                <p className="text-base leading-8 text-cream/85">“{item.quote}”</p>
                <footer className="mt-8">
                  <p className="font-display text-xl">{item.name}</p>
                  <p className="text-sm text-gold">
                    {item.place} · {item.project}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <p className="kicker">Latest</p>
        <h2 className="font-display mt-4 text-4xl md:text-5xl">In the making</h2>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {news.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-3xl border border-white/10 bg-panel">
              <div className="media-frame aspect-[16/9]">
                <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div className="p-8">
                <h3 className="font-display text-2xl">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted">{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden px-5 py-24 md:px-8">
        <Image
          src="/assets/images/news/cmrl-tower.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/80" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="kicker">Chennai Central Tower</p>
          <h2 className="font-display mt-4 text-4xl md:text-6xl">Towering 119 metres in the Chennai skyline</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-cream/80">
            A partnership with Chennai Metro Rail Limited to set a new urban benchmark — blending aesthetics, connectivity, and civic purpose.
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-flex rounded-full bg-brand px-7 py-3 text-sm tracking-[0.14em] uppercase text-white hover:bg-brand-bright"
          >
            Start a conversation
          </Link>
        </div>
      </section>
    </>
  );
}

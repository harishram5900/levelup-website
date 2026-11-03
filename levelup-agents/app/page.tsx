import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { PlatformMarquee } from "@/components/landing/PlatformMarquee";
import { Pipeline } from "@/components/landing/Pipeline";
import { AgentGrid } from "@/components/landing/AgentGrid";
import { TryIdea } from "@/components/landing/TryIdea";
import { Compare } from "@/components/landing/Compare";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { Waitlist } from "@/components/landing/Waitlist";
import { Footer } from "@/components/landing/Footer";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { TRACTION } from "@/lib/traction";

export default function Home() {
  const realStats = TRACTION.filter((t) => t.value !== null);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-bg-2 focus:px-4 focus:py-2">Skip to content</a>
      <Navbar />
      <main id="main">
        <Hero />
        <PlatformMarquee />

        <Section id="how">
          <Reveal><SectionHeading kicker="How it works" title={<>Six agents. <span className="text-gradient">One startup.</span></>} sub="Each agent handles one step of building a startup, in the order you need them. You always know what to do next." /></Reveal>
          <Pipeline />
        </Section>

        <Section id="agents" className="pt-0">
          <Reveal><SectionHeading kicker="Your co-founders" title="A whole founding team, on day one" sub="The help most young founders never get: honest feedback, a plan, and someone keeping you on track." /></Reveal>
          <AgentGrid />
        </Section>

        <Section id="try" className="pt-0">
          <Reveal><SectionHeading kicker="Try it free · No sign-up" title={<>Is your idea <span className="text-gradient">worth building?</span></>} sub="Answer a few questions and the Idea agent gives you a one-liner, your strengths, your biggest risks and three tests to run this week." /></Reveal>
          <Reveal><TryIdea /></Reveal>
        </Section>

        <Section className="pt-0">
          <Reveal><SectionHeading kicker="Why LevelUp" title="Building alone vs. building with LevelUp" /></Reveal>
          <Compare />
        </Section>

        {realStats.length > 0 && (
          <Section className="pt-0">
            <div className="grid gap-6 sm:grid-cols-3">
              {realStats.map((s) => (
                <Reveal key={s.label} className="text-center">
                  <CountUp to={s.value!} suffix={s.suffix} className="font-display text-6xl" />
                  <p className="mt-2 text-muted">{s.label}</p>
                </Reveal>
              ))}
            </div>
          </Section>
        )}

        <Section id="pricing" className="pt-0">
          <Reveal><SectionHeading kicker="Pricing" title="Free for student founders" sub="Start free. Upgrade when you want AI that writes for your exact startup." /></Reveal>
          <Pricing />
        </Section>

        <Section id="faq" className="pt-0" inner="max-w-3xl">
          <Reveal><SectionHeading kicker="FAQ" title="Questions, answered" /></Reveal>
          <Reveal><Faq /></Reveal>
        </Section>

        <Section id="waitlist" className="pt-0">
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] glass px-6 py-16 text-center sm:px-12">
              <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgb(var(--violet)/0.25),transparent_60%)]" />
              <h2 className="mx-auto max-w-2xl text-5xl sm:text-7xl">Get Pro <span className="text-gradient">first</span></h2>
              <p className="mx-auto mb-9 mt-4 max-w-lg text-lg text-muted">Join the waitlist for AI-written plans, pitch practice and early access to new agents.</p>
              <Waitlist />
            </div>
          </Reveal>
        </Section>
      </main>
      <Footer />
    </>
  );
}

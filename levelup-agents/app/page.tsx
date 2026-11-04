import { SkyHero } from "@/components/landing/SkyHero";
import { Pipeline } from "@/components/landing/Pipeline";
import { AgentGrid } from "@/components/landing/AgentGrid";
import { TryIdea } from "@/components/landing/TryIdea";
import { CharacterShowcase } from "@/components/landing/CharacterShowcase";
import { Compare } from "@/components/landing/Compare";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { Waitlist } from "@/components/landing/Waitlist";
import { Footer } from "@/components/landing/Footer";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export default function Home() {
  return (
    <div className="landing-light min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-bg-2 focus:px-4 focus:py-2">Skip to content</a>
      <SkyHero />
      <main id="main">

        <Section id="how">
          <Reveal><SectionHeading kicker="How it works" title={<>12 agents. <span className="text-gradient">One startup.</span></>} sub="Each agent handles one step of building a startup, in the order you need them, grouped into 4 worlds. You always know what to do next." /></Reveal>
          <Pipeline />
        </Section>

        <Section id="characters" className="pt-0">
          <Reveal><SectionHeading kicker="Pick your co-founder" title={<>Five co-founders. <span className="text-gradient">Pick yours.</span></>} sub="Each one has a different personality and guides you through every step, from your first idea to your pitch." /></Reveal>
          <CharacterShowcase />
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


        <Section id="pricing" className="pt-0">
          <Reveal><SectionHeading kicker="Pricing" title="Free for student founders" sub="Start free. Go Pro when you're ready to price, sell, launch and raise." /></Reveal>
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
    </div>
  );
}

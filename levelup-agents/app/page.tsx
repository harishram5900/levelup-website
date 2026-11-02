import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { PlatformMarquee } from "@/components/landing/PlatformMarquee";
import { Pipeline } from "@/components/landing/Pipeline";
import { AgentGrid } from "@/components/landing/AgentGrid";
import { Showcase } from "@/components/landing/Showcase";
import { Compare } from "@/components/landing/Compare";
import { FreePlanTool } from "@/components/landing/FreePlanTool";
import { NurtureTeaser } from "@/components/landing/NurtureTeaser";
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
          <Reveal><SectionHeading kicker="How it works" title={<>Six agents. <span className="text-gradient">One loop.</span></>} sub="Each agent does one job well, then hands off to the next. After every post, the loop starts again, a little smarter." /></Reveal>
          <Pipeline />
        </Section>

        <Section id="agents" className="pt-0">
          <Reveal><SectionHeading kicker="The team" title="Meet your marketing team" sub="No hiring, no briefs, no waiting on drafts." /></Reveal>
          <AgentGrid />
        </Section>

        <Section className="pt-0">
          <Reveal><SectionHeading kicker="The product" title="Everything in one calm place" /></Reveal>
          <Reveal><Showcase /></Reveal>
        </Section>

        <Section id="free-plan" className="pt-0">
          <Reveal><SectionHeading kicker="Free tool · Works today" title={<>Get a week of posts <span className="text-gradient">in 10 seconds</span></>} sub="Tell us about your business and get 7 ready-to-film ideas with hooks, shot lists and captions. Free, no sign-up." /></Reveal>
          <Reveal><FreePlanTool /></Reveal>
        </Section>

        <Section className="pt-0">
          <Reveal><SectionHeading kicker="Why LevelUp" title="An agency's work, without the agency" /></Reveal>
          <Compare />
        </Section>

        {realStats.length > 0 && (
          <Section className="pt-0">
            <div className="grid gap-6 sm:grid-cols-3">
              {realStats.map((s) => (
                <Reveal key={s.label} className="text-center">
                  <CountUp to={s.value!} suffix={s.suffix} className="font-display text-5xl font-bold" />
                  <p className="mt-2 text-muted">{s.label}</p>
                </Reveal>
              ))}
            </div>
          </Section>
        )}

        <Section id="nurture" className="pt-0"><NurtureTeaser /></Section>

        <Section id="pricing" className="pt-0">
          <Reveal><SectionHeading kicker="Pricing" title="Simple plans that grow with you" sub="A fraction of an agency retainer. Every plan is free while we're in beta." /></Reveal>
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
              <h2 className="mx-auto max-w-2xl text-4xl font-bold sm:text-5xl">Get your marketing team <span className="text-gradient">this week</span></h2>
              <p className="mx-auto mb-9 mt-4 max-w-lg text-lg text-muted">Join the waitlist for early access. Free during beta.</p>
              <Waitlist />
            </div>
          </Reveal>
        </Section>
      </main>
      <Footer />
    </>
  );
}

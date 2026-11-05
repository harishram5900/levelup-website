/**
 * Where to launch and where customers hang out, matched to a startup's niche.
 * Launch sites were checked when this list was built. Community rules change, so the
 * Traction agent always tells founders to read each community's rules before posting.
 */
import { tagsFor, type Tag } from "./opportunities";

export type Directory = { name: string; url: string; tags: Tag[]; how: string; best: string };
export type Community = { name: string; url: string; tags: Tag[]; angle: string };

export const DIRECTORIES: Directory[] = [
  { name: "Product Hunt", url: "https://www.producthunt.com", tags: ["tech", "ai", "consumer", "design", "edtech", "fintech"], best: "Apps, websites and AI tools", how: "Launch at 12:01am Pacific on a Tuesday-Thursday. Prepare a tagline, 4-6 screenshots, a short demo video and a first comment telling your story. Ask supporters to visit and comment, not to upvote blindly." },
  { name: "Show HN (Hacker News)", url: "https://news.ycombinator.com/showhn.html", tags: ["tech", "ai", "coding", "hardware", "science"], best: "Anything technical people can try right away", how: "Title: \"Show HN: [name] – [what it does in plain words]\". It must be usable without signing up if possible. Stay in the comments for hours and answer every question honestly." },
  { name: "BetaList", url: "https://betalist.com/submit", tags: ["tech", "ai", "consumer", "edtech", "fintech"], best: "Pre-launch startups collecting early users", how: "Submit before launch with a clear landing page and email sign-up. Free listings can wait in a queue, so submit early." },
  { name: "Indie Hackers", url: "https://www.indiehackers.com", tags: ["tech", "ai", "business", "coding"], best: "Founders building in public", how: "Post your journey with real numbers and lessons. Milestone posts (first user, first $) do best. Pure ads get ignored." },
  { name: "Uneed", url: "https://www.uneed.best", tags: ["tech", "ai", "design"], best: "Tools and SaaS", how: "Free daily launch queue. Pick a launch date, add good visuals and share your launch link on the day." },
  { name: "Peerlist Launchpad", url: "https://peerlist.io/launchpad", tags: ["tech", "ai", "coding", "design"], best: "Products made by developers and designers", how: "Weekly launches voted by the Peerlist community. Build a profile first, then launch on Monday." },
  { name: "Microlaunch", url: "https://microlaunch.net", tags: ["tech", "ai", "business"], best: "Small products and side projects", how: "Month-long launch window with feedback from other makers. Good for collecting honest reviews." },
  { name: "DevHunt", url: "https://devhunt.org", tags: ["coding", "tech"], best: "Developer tools", how: "Weekly launches for dev tools, voted by developers via GitHub login." },
  { name: "Fazier", url: "https://fazier.com", tags: ["tech", "ai", "design"], best: "Startups and tools", how: "Free launch platform with daily rankings. Submit, schedule, then share your launch link." },
  { name: "Tiny Startups", url: "https://www.tinystartups.com", tags: ["tech", "ai", "business"], best: "Small and indie products", how: "Submit your product for the newsletter and directory." },
  { name: "TinyLaunch", url: "https://tinylaunch.com", tags: ["tech", "ai"], best: "Indie products", how: "Weekly launches for small products. Free tier available." },
  { name: "Launching Next", url: "https://www.launchingnext.com", tags: ["tech", "business", "consumer"], best: "New startups of any kind", how: "Free directory submission. Low effort, small but steady traffic." },
  { name: "There's An AI For That", url: "https://theresanaiforthat.com", tags: ["ai"], best: "AI tools", how: "The largest AI tool directory. Submit with a clear use-case title (\"AI for practicing speeches\")." },
  { name: "Futurepedia", url: "https://www.futurepedia.io", tags: ["ai"], best: "AI tools", how: "AI tool directory with categories. Pick the most specific category you fit." },
  { name: "Future Tools", url: "https://www.futuretools.io", tags: ["ai"], best: "AI tools", how: "Curated AI tool list. Submit a short, specific description." },
  { name: "AlternativeTo", url: "https://alternativeto.net", tags: ["tech", "ai", "consumer", "edtech"], best: "Being found as an alternative to a big competitor", how: "List your product as an alternative to the competitors your Scout agent found. People search \"alternative to X\" with buying intent." },
  { name: "SaaSHub", url: "https://www.saashub.com", tags: ["tech", "ai", "business"], best: "Software and SaaS", how: "Free listing. Add your competitors as alternatives so you show up on their pages." },
  { name: "SideProjectors", url: "https://sideprojectors.com", tags: ["tech", "coding"], best: "Side projects", how: "Showcase your project and get feedback from other makers." },
  { name: "dev.to", url: "https://dev.to", tags: ["coding", "tech"], best: "Developer audiences", how: "Write a \"How I built [product]\" post with code and lessons. Tutorials beat announcements." },
  { name: "Hashnode", url: "https://hashnode.com", tags: ["coding", "tech"], best: "Developer audiences", how: "Start a free dev blog. Post build logs and link your product at the end." },
  { name: "itch.io", url: "https://itch.io", tags: ["design", "coding", "consumer"], best: "Games and creative tools", how: "Publish a free demo, join a game jam to get your first players, and post devlogs." },
  { name: "Etsy", url: "https://www.etsy.com", tags: ["design", "consumer", "business"], best: "Physical or digital products, templates, art", how: "Use the exact words buyers search for in your title. Great photos matter more than anything else." },
  { name: "Educational App Store", url: "https://educationalappstore.com", tags: ["edtech"], best: "Education apps", how: "Submit your app for teacher review and certification." },
  { name: "Common Sense Education", url: "https://www.commonsense.org/education", tags: ["edtech"], best: "Being trusted by teachers and parents", how: "Teachers read these reviews. Aim to be reviewed once you have real classroom users." },
  { name: "Kickstarter", url: "https://www.kickstarter.com", tags: ["hardware", "design", "consumer"], best: "Physical products and creative projects", how: "Pre-sell before you manufacture. Under-18 founders need a parent or guardian to run the campaign." },
  { name: "Substack or beehiiv newsletter", url: "https://substack.com", tags: ["any", "edtech", "business", "social"], best: "Owning your audience", how: "Start a free newsletter about your niche. Every launch gets easier when you own an email list." },
  { name: "Luma or Meetup event", url: "https://lu.ma", tags: ["any", "social", "edtech", "business"], best: "Local and online community events", how: "Host a free workshop on the problem you solve. Attendees become your first users." },
];

/** Real, long-standing subreddits and communities by niche. Always read each one's rules first. */
export const COMMUNITIES: Community[] = [
  // Founders and makers (feedback, building in public)
  { name: "r/SideProject", url: "https://www.reddit.com/r/SideProject", tags: ["any", "tech", "ai", "coding"], angle: "Share what you built and ask for honest feedback. Self-made projects are welcome here." },
  { name: "r/startups", url: "https://www.reddit.com/r/startups", tags: ["any", "business"], angle: "No self-promotion. Ask a specific question or share a lesson; use their weekly feedback thread for your link." },
  { name: "r/Entrepreneur", url: "https://www.reddit.com/r/Entrepreneur", tags: ["any", "business"], angle: "Share a story with real numbers and lessons. Promotion is limited, so lead with value." },
  { name: "r/EntrepreneurRideAlong", url: "https://www.reddit.com/r/EntrepreneurRideAlong", tags: ["any", "business"], angle: "Build-in-public updates: what you tried this week and what happened." },
  { name: "r/smallbusiness", url: "https://www.reddit.com/r/smallbusiness", tags: ["business"], angle: "Help others first. Good for service and local businesses." },
  { name: "r/indiehackers", url: "https://www.reddit.com/r/indiehackers", tags: ["tech", "ai", "coding"], angle: "Milestones and lessons from building solo." },
  { name: "r/SaaS", url: "https://www.reddit.com/r/SaaS", tags: ["tech", "ai", "business"], angle: "Share growth lessons and ask for feedback on pricing or onboarding." },
  { name: "r/alphaandbetausers", url: "https://www.reddit.com/r/alphaandbetausers", tags: ["tech", "ai", "consumer"], angle: "Made for recruiting early testers. Say exactly what feedback you want." },
  { name: "r/roastmystartup", url: "https://www.reddit.com/r/roastmystartup", tags: ["any", "tech"], angle: "Ask for brutal feedback on your landing page or pitch." },
  // Students and education
  { name: "r/GetStudying", url: "https://www.reddit.com/r/GetStudying", tags: ["edtech"], angle: "Share study methods and what you learned. Mention your tool only if it genuinely helps." },
  { name: "r/HighschoolStudents", url: "https://www.reddit.com/r/HighschoolStudents", tags: ["edtech", "consumer"], angle: "Ask students about their struggles (great for customer interviews)." },
  { name: "r/college", url: "https://www.reddit.com/r/college", tags: ["edtech", "consumer"], angle: "Ask questions and learn how college students handle the problem. Strict on promotion." },
  { name: "r/Teachers", url: "https://www.reddit.com/r/Teachers", tags: ["edtech"], angle: "Read and listen first. Teachers dislike ads but love tools that save them time; ask for advice." },
  { name: "r/edtech", url: "https://www.reddit.com/r/edtech", tags: ["edtech"], angle: "Discuss education products and get feedback from educators." },
  { name: "r/PublicSpeaking", url: "https://www.reddit.com/r/PublicSpeaking", tags: ["edtech"], angle: "Help people with speaking anxiety. Share tips; mention your tool when it answers the question." },
  { name: "r/languagelearning", url: "https://www.reddit.com/r/languagelearning", tags: ["edtech"], angle: "Share methods and resources. Strict rules on self-promotion." },
  // Tech, AI, coding
  { name: "r/artificial", url: "https://www.reddit.com/r/artificial", tags: ["ai"], angle: "Share interesting AI uses and demos." },
  { name: "r/ChatGPT", url: "https://www.reddit.com/r/ChatGPT", tags: ["ai"], angle: "Show a creative or useful AI workflow, not an ad." },
  { name: "r/learnprogramming", url: "https://www.reddit.com/r/learnprogramming", tags: ["coding", "edtech"], angle: "Help beginners. Great place to find users for coding education tools." },
  { name: "r/webdev", url: "https://www.reddit.com/r/webdev", tags: ["coding", "tech"], angle: "Showoff Saturday is the day to share what you built." },
  { name: "r/gamedev", url: "https://www.reddit.com/r/gamedev", tags: ["design", "coding"], angle: "Share devlogs and lessons. Use r/IndieDev for promotion." },
  { name: "r/IndieDev", url: "https://www.reddit.com/r/IndieDev", tags: ["design", "coding"], angle: "Share gameplay clips and progress." },
  { name: "r/robotics", url: "https://www.reddit.com/r/robotics", tags: ["hardware", "science"], angle: "Share builds with photos and what you learned." },
  { name: "r/arduino", url: "https://www.reddit.com/r/arduino", tags: ["hardware"], angle: "Project showcases with how-it-works details." },
  // Health, climate, social, money
  { name: "r/fitness", url: "https://www.reddit.com/r/fitness", tags: ["health"], angle: "Strict on promotion. Learn how people track progress and what frustrates them." },
  { name: "r/nutrition", url: "https://www.reddit.com/r/nutrition", tags: ["health"], angle: "Ask questions and learn the language your customers use." },
  { name: "r/productivity", url: "https://www.reddit.com/r/productivity", tags: ["consumer", "edtech", "tech"], angle: "Share a system that works for you. Tools are welcome when they add value." },
  { name: "r/sustainability", url: "https://www.reddit.com/r/sustainability", tags: ["climate"], angle: "Share projects and research. Ask for feedback on impact." },
  { name: "r/ZeroWaste", url: "https://www.reddit.com/r/ZeroWaste", tags: ["climate", "consumer"], angle: "Practical tips and products. Avoid sounding like an ad." },
  { name: "r/climate", url: "https://www.reddit.com/r/climate", tags: ["climate", "science"], angle: "News and discussion; better for learning than promoting." },
  { name: "r/nonprofit", url: "https://www.reddit.com/r/nonprofit", tags: ["social"], angle: "Ask nonprofit staff about their challenges. Good for B2B nonprofit tools." },
  { name: "r/volunteer", url: "https://www.reddit.com/r/volunteer", tags: ["social"], angle: "Find volunteers and partners for social-impact projects." },
  { name: "r/personalfinance", url: "https://www.reddit.com/r/personalfinance", tags: ["fintech"], angle: "No promotion. Learn how people budget and what confuses them." },
  { name: "r/financialindependence", url: "https://www.reddit.com/r/financialindependence", tags: ["fintech"], angle: "Discussion only. Great for understanding a money-savvy audience." },
  { name: "r/Design", url: "https://www.reddit.com/r/Design", tags: ["design"], angle: "Share work and process." },
  { name: "r/ecommerce", url: "https://www.reddit.com/r/ecommerce", tags: ["business", "consumer"], angle: "Share store lessons and ask for feedback." },
  { name: "r/Etsy", url: "https://www.reddit.com/r/Etsy", tags: ["design", "business"], angle: "Seller tips and shop feedback." },
  { name: "r/WomenInBusiness", url: "https://www.reddit.com/r/WomenInBusiness", tags: ["women", "business"], angle: "Share your journey and connect with other women founders." },
  { name: "r/Parenting", url: "https://www.reddit.com/r/Parenting", tags: ["consumer", "edtech", "health"], angle: "No promotion. Great for learning what parents worry about if parents pay for your product." },
];

const fits = (tags: Tag[], want: Tag[]) => tags.filter((t) => want.includes(t)).length * 3 + (tags.includes("any") ? 1 : 0);

export function matchDirectories(text: string, n = 8) {
  const want = tagsFor(text);
  return [...DIRECTORIES].map((d) => ({ d, s: fits(d.tags, want) })).sort((a, b) => b.s - a.s).slice(0, n).map((x) => x.d);
}
export function matchCommunities(text: string, n = 8) {
  const want = tagsFor(text);
  return [...COMMUNITIES].map((c) => ({ c, s: fits(c.tags, want) })).sort((a, b) => b.s - a.s).slice(0, n).map((x) => x.c);
}

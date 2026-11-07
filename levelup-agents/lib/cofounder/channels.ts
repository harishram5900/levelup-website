/**
 * Where to launch and where customers hang out, matched to a startup's niche.
 * Launch sites were checked when this list was built. Community rules change, so the
 * Traction agent always tells founders to read each community's rules before posting.
 */
import { tagsFor, type Tag } from "./opportunities";
import type { Kind } from "./context";

/** `kinds` limits an entry to some kinds of business (e.g. app-only launch sites); `kw` boosts it when the founder's words match. */
export type Directory = { name: string; url: string; tags: Tag[]; how: string; best: string; kinds?: Kind[]; kw?: RegExp };
export type Community = { name: string; url: string; tags: Tag[]; angle: string; kinds?: Kind[]; kw?: RegExp };

export const DIRECTORIES: Directory[] = [
  { name: "Product Hunt", url: "https://www.producthunt.com", tags: ["tech", "ai", "consumer", "design", "edtech", "fintech"], best: "Apps, websites and AI tools", how: "Launch at 12:01am Pacific on a Tuesday-Thursday. Prepare a tagline, 4-6 screenshots, a short demo video and a first comment telling your story. Ask supporters to visit and comment, not to upvote blindly.", kinds: ["app"] },
  { name: "Show HN (Hacker News)", url: "https://news.ycombinator.com/showhn.html", tags: ["tech", "ai", "coding", "hardware", "science"], kinds: ["app", "product"], best: "Anything technical people can try right away", how: "Title: \"Show HN: [name] – [what it does in plain words]\". It must be usable without signing up if possible. Stay in the comments for hours and answer every question honestly." },
  { name: "BetaList", url: "https://betalist.com/submit", tags: ["tech", "ai", "consumer", "edtech", "fintech"], best: "Pre-launch startups collecting early users", how: "Submit before launch with a clear landing page and email sign-up. Free listings can wait in a queue, so submit early.", kinds: ["app"] },
  { name: "Indie Hackers", url: "https://www.indiehackers.com", tags: ["tech", "ai", "business", "coding"], best: "Founders building in public", how: "Post your journey with real numbers and lessons. Milestone posts (first user, first $) do best. Pure ads get ignored." },
  { name: "Uneed", url: "https://www.uneed.best", tags: ["tech", "ai", "design"], best: "Tools and SaaS", how: "Free daily launch queue. Pick a launch date, add good visuals and share your launch link on the day.", kinds: ["app"] },
  { name: "Peerlist Launchpad", url: "https://peerlist.io/launchpad", tags: ["tech", "ai", "coding", "design"], best: "Products made by developers and designers", how: "Weekly launches voted by the Peerlist community. Build a profile first, then launch on Monday.", kinds: ["app"] },
  { name: "Microlaunch", url: "https://microlaunch.net", tags: ["tech", "ai", "business"], best: "Small products and side projects", how: "Month-long launch window with feedback from other makers. Good for collecting honest reviews.", kinds: ["app"] },
  { name: "DevHunt", url: "https://devhunt.org", tags: ["coding", "tech"], best: "Developer tools", how: "Weekly launches for dev tools, voted by developers via GitHub login.", kinds: ["app"] },
  { name: "Fazier", url: "https://fazier.com", tags: ["tech", "ai", "design"], best: "Startups and tools", how: "Free launch platform with daily rankings. Submit, schedule, then share your launch link.", kinds: ["app"] },
  { name: "Tiny Startups", url: "https://www.tinystartups.com", tags: ["tech", "ai", "business"], best: "Small and indie products", how: "Submit your product for the newsletter and directory.", kinds: ["app"] },
  { name: "TinyLaunch", url: "https://tinylaunch.com", tags: ["tech", "ai"], best: "Indie products", how: "Weekly launches for small products. Free tier available.", kinds: ["app"] },
  { name: "Launching Next", url: "https://www.launchingnext.com", tags: ["tech", "business", "consumer"], best: "New startups of any kind", how: "Free directory submission. Low effort, small but steady traffic." },
  { name: "There's An AI For That", url: "https://theresanaiforthat.com", tags: ["ai"], best: "AI tools", how: "The largest AI tool directory. Submit with a clear use-case title (\"AI for practicing speeches\").", kinds: ["app"] },
  { name: "Futurepedia", url: "https://www.futurepedia.io", tags: ["ai"], best: "AI tools", how: "AI tool directory with categories. Pick the most specific category you fit.", kinds: ["app"] },
  { name: "Future Tools", url: "https://www.futuretools.io", tags: ["ai"], best: "AI tools", how: "Curated AI tool list. Submit a short, specific description.", kinds: ["app"] },
  { name: "AlternativeTo", url: "https://alternativeto.net", tags: ["tech", "ai", "consumer", "edtech"], best: "Being found as an alternative to a big competitor", how: "List your product as an alternative to the competitors your Scout agent found. People search \"alternative to X\" with buying intent." },
  { name: "SaaSHub", url: "https://www.saashub.com", tags: ["tech", "ai", "business"], best: "Software and SaaS", how: "Free listing. Add your competitors as alternatives so you show up on their pages.", kinds: ["app"] },
  { name: "SideProjectors", url: "https://sideprojectors.com", tags: ["tech", "coding"], best: "Side projects", how: "Showcase your project and get feedback from other makers.", kinds: ["app"] },
  { name: "dev.to", url: "https://dev.to", tags: ["coding", "tech"], best: "Developer audiences", how: "Write a \"How I built [product]\" post with code and lessons. Tutorials beat announcements.", kinds: ["app"] },
  { name: "Hashnode", url: "https://hashnode.com", tags: ["coding", "tech"], best: "Developer audiences", how: "Start a free dev blog. Post build logs and link your product at the end.", kinds: ["app"] },
  { name: "itch.io", url: "https://itch.io", tags: ["design", "coding", "consumer"], kinds: ["app"], kw: /\bgames?\b|gamers?|pixel/i, best: "Games and creative tools", how: "Publish a free demo, join a game jam to get your first players, and post devlogs." },
  { name: "Etsy", url: "https://www.etsy.com", tags: ["design", "consumer", "business"], kinds: ["product"], kw: /handmade|crafts?|jewelry|candles?|stickers?|prints?|art|vintage/i, best: "Physical or digital products, templates, art", how: "Use the exact words buyers search for in your title. Great photos matter more than anything else." },
  { name: "Educational App Store", url: "https://educationalappstore.com", tags: ["edtech"], best: "Education apps", how: "Submit your app for teacher review and certification.", kinds: ["app"] },
  { name: "Common Sense Education", url: "https://www.commonsense.org/education", tags: ["edtech"], best: "Being trusted by teachers and parents", how: "Teachers read these reviews. Aim to be reviewed once you have real classroom users." },
  { name: "Kickstarter", url: "https://www.kickstarter.com", tags: ["hardware", "design", "consumer"], kinds: ["product", "app"], kw: /sensor|device|hardware|gadget|kit|prototype|board game/i, best: "Physical products and creative projects", how: "Pre-sell before you manufacture. Under-18 founders need a parent or guardian to run the campaign." },
  { name: "Substack or beehiiv newsletter", url: "https://substack.com", tags: ["any", "edtech", "business", "social"], best: "Owning your audience", how: "Start a free newsletter about your niche. Every launch gets easier when you own an email list." },
  // Local and in-person: the launch channels that matter most for food, products and services
  { name: "School events and pop-up table", url: "https://www.google.com/search?q=youth+pop+up+market+near+me", tags: ["business", "consumer"], kinds: ["food", "product", "service", "social"], best: "Food, handmade products and local services", how: "Ask your school (or a club) for a table at games, fairs and club nights. Bring samples, a sign with your price and a QR code to your order form. Count how many people stop, taste and buy." },
  { name: "Farmers market or craft fair", url: "https://www.google.com/search?q=farmers+market+vendor+application+near+me", tags: ["business", "consumer"], kinds: ["food", "product"], best: "Food and handmade products", how: "Search your town's market vendor application. Youth or one-day stalls are often cheap. Check local food rules first (many states have cottage food laws for homemade baked goods)." },
  { name: "Nextdoor", url: "https://nextdoor.com", tags: ["business", "consumer", "social"], kinds: ["food", "product", "service", "social"], best: "Neighbors who buy local", how: "Post once as a neighbor, not an ad: who you are, what you offer, one photo, how to order. Use the business page feature if you keep posting." },
  { name: "Google Business Profile", url: "https://www.google.com/business", tags: ["business"], kinds: ["service", "food"], best: "Being found on Google Maps for local searches", how: "Free. Add your service area, real photos and prices. Ask every happy customer for a review; reviews drive local search." },
  { name: "Instagram shop and DM-to-order", url: "https://www.instagram.com", tags: ["consumer", "design", "business"], kinds: ["food", "product"], best: "Visual products people buy from photos", how: "Pin 3 posts: what you sell, prices, how to order. Post real customer photos and a weekly drop day so people know when to buy." },
  { name: "Depop", url: "https://www.depop.com", tags: ["design", "consumer"], kinds: ["product"], kw: /vintage|thrift|resell|resale|streetwear|clothes|clothing|depop|sneakers?/i, best: "Fashion resale for Gen Z", how: "Shoot on a person or flat lay in daylight, use the exact brand and era in titles, and list daily. Bundle discounts help sell more per buyer." },
  { name: "Grailed", url: "https://www.grailed.com", tags: ["design", "consumer"], kinds: ["product"], kw: /streetwear|sneakers?|designer|vintage/i, best: "Higher-end streetwear and designer resale", how: "Detailed measurements and tag photos build trust. Price against recent sold listings." },
  { name: "Shopify or Square Online store", url: "https://squareup.com/us/en/online-store", tags: ["business", "consumer"], kinds: ["food", "product"], best: "Your own store once orders are steady", how: "Start with a free Square Online page for preorders. Move to Shopify when you sell weekly. Under 18 you'll need a parent on the account." },
  { name: "App Store and Google Play listing", url: "https://developer.apple.com/app-store/product-page", tags: ["tech", "consumer"], kinds: ["app"], kw: /mobile|ios|android|game|app/i, best: "Mobile apps and games", how: "Your first screenshot and subtitle decide most installs. Put the main benefit in big words on screenshot 1 and use the words people search for in the subtitle." },
  { name: "Local nonprofit and school partners", url: "https://www.idealist.org", tags: ["social"], kinds: ["social"], best: "Social-impact pilots", how: "Email one partner organization with a one-page pilot plan: what you'll do, for how long, what it costs them (ideally nothing) and how you'll measure results." },
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
  { name: "r/indiehackers", url: "https://www.reddit.com/r/indiehackers", tags: ["tech", "ai", "coding"], angle: "Milestones and lessons from building solo.", kinds: ["app"] },
  { name: "r/SaaS", url: "https://www.reddit.com/r/SaaS", tags: ["tech", "ai", "business"], angle: "Share growth lessons and ask for feedback on pricing or onboarding.", kinds: ["app"] },
  { name: "r/alphaandbetausers", url: "https://www.reddit.com/r/alphaandbetausers", tags: ["tech", "ai", "consumer"], angle: "Made for recruiting early testers. Say exactly what feedback you want.", kinds: ["app"] },
  { name: "r/roastmystartup", url: "https://www.reddit.com/r/roastmystartup", tags: ["any", "tech"], angle: "Ask for brutal feedback on your landing page or pitch." },
  // Students and education
  { name: "r/GetStudying", url: "https://www.reddit.com/r/GetStudying", tags: ["edtech"], angle: "Share study methods and what you learned. Mention your tool only if it genuinely helps." },
  { name: "r/HighschoolStudents", url: "https://www.reddit.com/r/HighschoolStudents", tags: ["edtech", "consumer"], angle: "Ask students about their struggles (great for customer interviews)." },
  { name: "r/college", url: "https://www.reddit.com/r/college", tags: ["edtech", "consumer"], angle: "Ask questions and learn how college students handle the problem. Strict on promotion." },
  { name: "r/Teachers", url: "https://www.reddit.com/r/Teachers", tags: ["edtech"], angle: "Read and listen first. Teachers dislike ads but love tools that save them time; ask for advice." },
  { name: "r/edtech", url: "https://www.reddit.com/r/edtech", tags: ["edtech"], angle: "Discuss education products and get feedback from educators." },
  { name: "r/PublicSpeaking", kw: /speak|speech|public speaking|presentation/i, url: "https://www.reddit.com/r/PublicSpeaking", tags: ["edtech"], angle: "Help people with speaking anxiety. Share tips; mention your tool when it answers the question." },
  { name: "r/languagelearning", kw: /language|spanish|french|vocab/i, url: "https://www.reddit.com/r/languagelearning", tags: ["edtech"], angle: "Share methods and resources. Strict rules on self-promotion." },
  // Tech, AI, coding
  { name: "r/artificial", url: "https://www.reddit.com/r/artificial", tags: ["ai"], angle: "Share interesting AI uses and demos.", kinds: ["app"] },
  { name: "r/ChatGPT", url: "https://www.reddit.com/r/ChatGPT", tags: ["ai"], angle: "Show a creative or useful AI workflow, not an ad.", kinds: ["app"] },
  { name: "r/learnprogramming", kw: /cod(e|ing)|programm/i, url: "https://www.reddit.com/r/learnprogramming", tags: ["coding", "edtech"], angle: "Help beginners. Great place to find users for coding education tools." },
  { name: "r/webdev", url: "https://www.reddit.com/r/webdev", tags: ["coding", "tech"], angle: "Showoff Saturday is the day to share what you built.", kinds: ["app"] },
  { name: "r/gamedev", kw: /\bgames?\b|gamers?/i, url: "https://www.reddit.com/r/gamedev", tags: ["design", "coding"], angle: "Share devlogs and lessons. Use r/IndieDev for promotion." },
  { name: "r/IndieDev", kw: /\bgames?\b|gamers?/i, url: "https://www.reddit.com/r/IndieDev", tags: ["design", "coding"], angle: "Share gameplay clips and progress." },
  { name: "r/robotics", kw: /robot/i, url: "https://www.reddit.com/r/robotics", tags: ["hardware", "science"], angle: "Share builds with photos and what you learned." },
  { name: "r/arduino", kw: /sensor|arduino|hardware|prototype|electronics/i, url: "https://www.reddit.com/r/arduino", tags: ["hardware"], angle: "Project showcases with how-it-works details." },
  // Health, climate, social, money
  { name: "r/fitness", kw: /fitness|workout|gym|exercise/i, url: "https://www.reddit.com/r/fitness", tags: ["health"], angle: "Strict on promotion. Learn how people track progress and what frustrates them." },
  { name: "r/nutrition", kw: /nutrition|diet|healthy eating|meal prep/i, url: "https://www.reddit.com/r/nutrition", tags: ["health"], angle: "Ask questions and learn the language your customers use." },
  { name: "r/productivity", url: "https://www.reddit.com/r/productivity", tags: ["consumer", "edtech", "tech"], angle: "Share a system that works for you. Tools are welcome when they add value." },
  { name: "r/sustainability", url: "https://www.reddit.com/r/sustainability", tags: ["climate"], angle: "Share projects and research. Ask for feedback on impact." },
  { name: "r/ZeroWaste", url: "https://www.reddit.com/r/ZeroWaste", tags: ["climate", "consumer"], angle: "Practical tips and products. Avoid sounding like an ad." },
  { name: "r/climate", url: "https://www.reddit.com/r/climate", tags: ["climate", "science"], angle: "News and discussion; better for learning than promoting." },
  { name: "r/nonprofit", url: "https://www.reddit.com/r/nonprofit", tags: ["social"], angle: "Ask nonprofit staff about their challenges. Good for B2B nonprofit tools." },
  { name: "r/volunteer", url: "https://www.reddit.com/r/volunteer", tags: ["social"], angle: "Find volunteers and partners for social-impact projects." },
  { name: "r/personalfinance", kw: /budget|money|paycheck|saving|finance/i, url: "https://www.reddit.com/r/personalfinance", tags: ["fintech"], angle: "No promotion. Learn how people budget and what confuses them." },
  { name: "r/financialindependence", url: "https://www.reddit.com/r/financialindependence", tags: ["fintech"], angle: "Discussion only. Great for understanding a money-savvy audience." },
  { name: "r/Design", url: "https://www.reddit.com/r/Design", tags: ["design"], angle: "Share work and process." },
  { name: "r/ecommerce", url: "https://www.reddit.com/r/ecommerce", tags: ["business", "consumer"], angle: "Share store lessons and ask for feedback." },
  { name: "r/Etsy", kinds: ["product"], url: "https://www.reddit.com/r/Etsy", tags: ["design", "business"], angle: "Seller tips and shop feedback." },
  { name: "r/WomenInBusiness", url: "https://www.reddit.com/r/WomenInBusiness", tags: ["women", "business"], angle: "Share your journey and connect with other women founders." },
  // Niche communities for non-app businesses and specific audiences
  { name: "r/Baking", url: "https://www.reddit.com/r/Baking", tags: ["consumer"], kinds: ["food"], kw: /bak|cupcake|cake|cookie|bread|dessert/i, angle: "Share bakes with the recipe or technique. Great for feedback on flavors and decorating; no selling." },
  { name: "r/cakedecorating", url: "https://www.reddit.com/r/cakedecorating", tags: ["consumer", "design"], kinds: ["food"], kw: /cake|cupcake|custom/i, angle: "Show custom designs and ask for feedback. Builds your eye for what people love." },
  { name: "r/foodbusiness", url: "https://www.reddit.com/r/foodbusiness", tags: ["business"], kinds: ["food"], angle: "Ask about pricing, food permits and scaling a home food business." },
  { name: "r/Depop", url: "https://www.reddit.com/r/Depop", tags: ["design", "business"], kinds: ["product"], kw: /depop|resell|resale|vintage|thrift/i, angle: "Seller tips: pricing, photos and shipping. Ask how others grew their shop." },
  { name: "r/Flipping", url: "https://www.reddit.com/r/Flipping", tags: ["business"], kinds: ["product"], kw: /resell|resale|flip|thrift|vintage/i, angle: "Share hauls and what sold for how much. Real numbers get the best answers." },
  { name: "r/ThriftStoreHauls", url: "https://www.reddit.com/r/ThriftStoreHauls", tags: ["design", "consumer"], kinds: ["product"], kw: /thrift|vintage/i, angle: "Post great finds. Good for learning what thrift fans get excited about." },
  { name: "r/streetwear", url: "https://www.reddit.com/r/streetwear", tags: ["design", "consumer"], kinds: ["product"], kw: /streetwear|hoodies?|sneakers?|clothing|clothes/i, angle: "Fit pics and feedback threads. Show your custom pieces worn, not as ads." },
  { name: "r/Sneakers", url: "https://www.reddit.com/r/Sneakers", tags: ["design", "consumer"], kinds: ["product"], kw: /sneakers?/i, angle: "Strict on selling. Learn what sneaker fans value and the language they use." },
  { name: "r/Journaling", url: "https://www.reddit.com/r/Journaling", tags: ["health"], kw: /journal/i, angle: "Share prompts and methods that helped you. Mention your app only where it fits the conversation." },
  { name: "r/Anxiety", url: "https://www.reddit.com/r/Anxiety", tags: ["health"], kw: /anxiety|stress|mental health/i, angle: "Support community, not a marketing channel. Read to understand what people struggle with; never promote." },
  { name: "r/teenagers", url: "https://www.reddit.com/r/teenagers", tags: ["consumer", "edtech"], kw: /teens?|high school/i, angle: "Huge teen audience with strict self-promo rules. Ask a genuine question to learn, not to sell." },
  { name: "r/HomeImprovement", url: "https://www.reddit.com/r/HomeImprovement", tags: ["hardware", "consumer"], kw: /\bhomes?\b|homeowners?|\blead\b|tap water|\bhouses?\b/i, angle: "Homeowners asking real questions. Answer helpfully; it's the best place to learn what worries them." },
  { name: "r/WaterTreatment", url: "https://www.reddit.com/r/WaterTreatment", tags: ["hardware", "health", "climate"], kw: /water|lead|filter/i, angle: "People testing and treating their water. Ask what tests they used and what they wished existed." },
  { name: "r/learnmath", url: "https://www.reddit.com/r/learnmath", tags: ["edtech"], kw: /math|algebra|calculus|geometry/i, angle: "Help students with math questions. You'll learn exactly where they get stuck." },
  { name: "r/HomeworkHelp", url: "https://www.reddit.com/r/HomeworkHelp", tags: ["edtech"], kw: /tutor|homework|math|study/i, angle: "Answer questions well. Students who need tutoring are already here." },
  { name: "r/IndieGaming", url: "https://www.reddit.com/r/IndieGaming", tags: ["design", "consumer"], kw: /\bgames?\b|gamers?/i, angle: "Short gameplay GIFs do best. Show, don't describe." },
  { name: "r/CozyGamers", url: "https://www.reddit.com/r/CozyGamers", tags: ["design", "consumer"], kw: /cozy|relaxing|casual|puzzle/i, angle: "Players who love calm games. Share a clip and ask what makes a game feel cozy to them." },
  { name: "r/AndroidGaming", url: "https://www.reddit.com/r/AndroidGaming", tags: ["design", "consumer"], kw: /mobile|android|\bgames?\b/i, angle: "Read the self-promo rules. A short trailer plus 'made by a teen' honesty goes a long way." },
  { name: "r/povertyfinance", url: "https://www.reddit.com/r/povertyfinance", tags: ["fintech", "social"], kw: /budget|paycheck|money|saving/i, angle: "Practical money advice for tight budgets. Learn first; promotion isn't welcome." },
  { name: "r/Frugal", url: "https://www.reddit.com/r/Frugal", tags: ["fintech", "consumer"], kw: /budget|saving|cheap|frugal/i, angle: "Share real money-saving tips. Your users' language lives here." },
  { name: "r/foodbank", url: "https://www.reddit.com/r/foodbank", tags: ["social"], kw: /food bank|leftover|donat|shelter|food waste/i, angle: "Ask food bank volunteers and staff what donations they struggle to accept and why." },
  { name: "r/Parenting", url: "https://www.reddit.com/r/Parenting", tags: ["consumer", "edtech", "health"], angle: "No promotion. Great for learning what parents worry about if parents pay for your product." },
];

type Entry = { tags: Tag[]; kinds?: Kind[]; kw?: RegExp };
/** Kind-restricted entries only show for that kind; a keyword hit beats a tag hit; "any" is a small tiebreak. */
function rank<T extends Entry>(list: T[], text: string, n: number, kind?: Kind): T[] {
  const want = tagsFor(text);
  return list
    .filter((e) => !kind || !e.kinds || e.kinds.includes(kind))
    .map((e) => {
      const hits = e.tags.filter((t) => want.includes(t)).length;
      // Niche entries (with keywords) need a keyword hit or a strong tag match, so a fintech app doesn't get itch.io.
      if (e.kw && !e.kw.test(text)) return { e, s: hits >= 2 ? hits * 2 : 0 };
      return { e, s: hits * 3 + (e.tags.includes("any") ? 1 : 0) + (e.kw ? 8 : 0) + (kind && e.kinds?.includes(kind) ? 2 : 0) };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.e);
}

export function matchDirectories(text: string, n = 8, kind?: Kind) { return rank(DIRECTORIES, text, n, kind); }
export function matchCommunities(text: string, n = 8, kind?: Kind) { return rank(COMMUNITIES, text, n, kind); }

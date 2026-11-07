import type { Profile } from "@/lib/cofounder/profile";

/** Realistic young founders with very different ideas, used to test how much LevelUp actually helps. */
export type Persona = { key: string; niche: string; profile: Profile; answers: Record<string, Record<string, string>> };

export const PERSONAS: Persona[] = [
  {
    key: "bakery", niche: "homemade cupcakes",
    profile: { founder: "Aanya", startup: "Sweet Spot", idea: "sells homemade cupcakes at school events and through Instagram preorders", customer: "students and parents at my high school", stage: "launched" },
    answers: {
      idea: { problem: "School events have boring store-bought snacks and parents want something homemade", today: "They buy grocery store cookies", whyYou: "I've baked for 4 years and sold out at two bake sales" },
      customer: { where: "Instagram, school clubs, PTA group chat", learn: "Would parents preorder for birthdays?" },
      competitor: { niche: "custom cupcakes", alternatives: "Grocery store bakeries, Crumbl", different: "Custom flavors and cheaper" },
      money: { model: "Per dozen", price: "$24", costs: "60" },
      pitch: { story: "I sold out at my first bake sale in 20 minutes", traction: "Sold 140 cupcakes, 12 repeat customers", ask: "A youth business competition" },
      launch: { niche: "custom cupcakes", channels: "Instagram, TikTok", goal: "30 preorders" },
    },
  },
  {
    key: "climate", niche: "school food waste",
    profile: { founder: "Diego", startup: "LeftoverLoop", idea: "tracks cafeteria food waste and donates leftovers to local shelters", customer: "school cafeterias and food banks", stage: "idea" },
    answers: {
      idea: { problem: "Our cafeteria throws away trays of untouched food every day", today: "It goes in the trash", whyYou: "I volunteer at the food bank and saw both sides" },
      customer: { where: "Cafeteria managers, district sustainability office, food bank", learn: "What stops schools from donating today?" },
      competitor: { niche: "food waste donation app", alternatives: "Too Good To Go, Food Rescue US", different: "Built for schools, students run it" },
      money: { model: "Schools pay per year", price: "500", costs: "30" },
      pitch: { story: "I watched 40 untouched lunches get thrown out", traction: "", ask: "A climate grant" },
      launch: { niche: "school food waste", channels: "LinkedIn, school board meetings", goal: "Pilot at 1 school" },
    },
  },
  {
    key: "tutoring", niche: "peer tutoring app",
    profile: { founder: "Maya", startup: "StudyBuddy", idea: "matches students with a peer tutor from their own school for the same class", customer: "high school students struggling in math", stage: "building" },
    answers: {
      idea: { problem: "Students are too embarrassed to ask teachers and tutors are expensive", today: "YouTube, Khan Academy, paid tutors", whyYou: "I've tutored 30 classmates for free" },
      customer: { where: "Discord, school library, NHS chapter", learn: "Would students trust a peer over a pro?" },
      competitor: { niche: "peer tutoring app", alternatives: "Khan Academy, Chegg, Varsity Tutors", different: "Tutors from your own class and teacher" },
      money: { model: "Monthly subscription", price: "5", costs: "40" },
      pitch: { story: "I failed my first algebra test, then a friend's notes saved me", traction: "Waitlist of 85 students", ask: "Congressional App Challenge" },
      launch: { niche: "peer tutoring", channels: "TikTok, NHS chapter", goal: "200 sign-ups" },
    },
  },
  {
    key: "fashion", niche: "thrifted streetwear resale",
    profile: { founder: "Jordan", startup: "ReThread", idea: "buys vintage streetwear at thrift stores and resells it on Depop with custom edits", customer: "Gen Z sneaker and streetwear fans", stage: "launched" },
    answers: {
      idea: { problem: "Good vintage is hard to find and fast fashion is wasteful", today: "They scroll Depop for hours", whyYou: "I've flipped 200 items and have 2k followers" },
      customer: { where: "Depop, TikTok, Instagram, sneaker Discords", learn: "What makes them pay more for a piece?" },
      competitor: { niche: "vintage streetwear resale", alternatives: "Depop sellers, Grailed, thrift stores", different: "Custom embroidery on every piece" },
      money: { model: "Per item", price: "45", costs: "300" },
      pitch: { story: "I started with $40 at Goodwill", traction: "$3,100 in sales in 6 months", ask: "An investor for inventory" },
      launch: { niche: "vintage streetwear", channels: "TikTok, Depop", goal: "$1,000 month" },
    },
  },
  {
    key: "mental", niche: "teen mental health journaling",
    profile: { founder: "Priya", startup: "Unwind", idea: "is a journaling app with prompts that helps teens notice stress patterns", customer: "teens dealing with school stress", stage: "building" },
    answers: {
      idea: { problem: "Teens feel stressed but don't know why or what helps", today: "Notes app, nothing, or venting to friends", whyYou: "I struggled with anxiety and journaling helped me" },
      customer: { where: "School wellness club, Reddit, TikTok", learn: "Would they journal daily if it took 2 minutes?" },
      competitor: { niche: "teen journaling app", alternatives: "Daylio, Calm, Notes app", different: "Made by a teen, spots patterns" },
      money: { model: "Freemium", price: "4", costs: "25" },
      pitch: { story: "Journaling got me through finals junior year", traction: "40 beta testers", ask: "A health innovation competition" },
      launch: { niche: "teen journaling", channels: "TikTok, school wellness club", goal: "500 downloads" },
    },
  },
  {
    key: "hardware", niche: "low cost water quality sensor",
    profile: { founder: "Ethan", startup: "ClearFlow", idea: "is a $20 sensor that tests tap water for lead and texts families the results", customer: "families in older homes", stage: "building" },
    answers: {
      idea: { problem: "Families in old homes don't know if their tap water has lead", today: "Expensive lab tests or nothing", whyYou: "I built a prototype for the science fair" },
      customer: { where: "Neighborhood Facebook groups, city council meetings", learn: "Would they pay $20 for peace of mind?" },
      competitor: { niche: "home water quality test", alternatives: "Lab test kits, Brita filters", different: "Cheap, instant, texts you" },
      money: { model: "One-time purchase", price: "20", costs: "200" },
      pitch: { story: "My neighbor's kid had high lead levels", traction: "Working prototype, 2nd at regional science fair", ask: "ISEF and a hardware grant" },
      launch: { niche: "water quality sensor", channels: "Facebook groups, Kickstarter", goal: "100 pre-orders" },
    },
  },
  {
    key: "game", niche: "indie mobile puzzle game",
    profile: { founder: "Leo", startup: "Pixel Drift", idea: "is a relaxing mobile puzzle game where you rebuild a pixel-art city", customer: "casual mobile gamers aged 13 to 25", stage: "building" },
    answers: {
      idea: { problem: "Most mobile games are stressful and full of ads", today: "Candy Crush, Monument Valley", whyYou: "I've made 3 games on itch.io" },
      customer: { where: "itch.io, r/IndieDev, TikTok", learn: "Would players pay $3 instead of seeing ads?" },
      competitor: { niche: "relaxing puzzle game", alternatives: "Monument Valley, Townscaper", different: "Cozy city-building plus puzzles" },
      money: { model: "One-time purchase", price: "3", costs: "15" },
      pitch: { story: "I made my first game at 13 during lockdown", traction: "1,200 itch.io plays", ask: "A game jam prize" },
      launch: { niche: "cozy puzzle game", channels: "TikTok, itch.io, Reddit", goal: "1,000 wishlists" },
    },
  },
  {
    key: "fintech", niche: "budgeting app for teens",
    profile: { founder: "Sam", startup: "Stash", idea: "helps teens budget their first paycheck and save for goals", customer: "teens with their first part-time job", stage: "idea" },
    answers: {
      idea: { problem: "Teens get their first paycheck and spend it all in a week", today: "Nothing, or their parents' advice", whyYou: "I blew my first paycheck and learned the hard way" },
      customer: { where: "Coworkers at my job, school business club, TikTok", learn: "Would teens connect a bank account?" },
      competitor: { niche: "teen budgeting app", alternatives: "Greenlight, Step, Mint", different: "Built around goals, not parents' control" },
      money: { model: "Freemium", price: "3", costs: "20" },
      pitch: { story: "I spent my whole first paycheck on sneakers", traction: "", ask: "A fintech pitch competition" },
      launch: { niche: "teen budgeting", channels: "TikTok, school business club", goal: "300 sign-ups" },
    },
  },
];

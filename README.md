# LevelUp — Scholarships for Every Student

Frontend for **LevelUp**, a scholarship finder for every U.S. high schooler — citizens, green-card holders,
DACA recipients, undocumented students, TPS holders, refugees/asylees, and F-1 / dependent / other visa holders.

Students take a 6-step questionnaire, the AI backend scans ~650–700 scholarships, and results come back
ranked by match score and grouped into 14 categories.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router · lucide-react icons

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck + production build to dist/
```

## Pages

| Route       | What it does |
|-------------|--------------|
| `/`         | Landing page: hero, how it works, statuses we support, categories |
| `/start`    | 6-step questionnaire (basics → **immigration status** → academics → background → activities → preferences) |
| `/matching` | Animated "AI scanning" screen while the match request runs |
| `/results`  | Dashboard: stats, category sidebar with counts, search, sort, filters, match-score cards, detail drawer |
| `/saved`    | Bookmarked scholarships sorted by deadline, with applied tracking |

Profile, results, saved and applied lists persist in `localStorage`.

## Connecting the backend

Set `VITE_API_URL` in `.env.local`:

```
VITE_API_URL=https://api.example.com
```

The app will `POST ${VITE_API_URL}/match` with `{ "profile": StudentProfile }` and expects
`{ "results": MatchedScholarship[] }` back. See `src/lib/types.ts` for both shapes and `src/lib/api.ts`
for the call. Without `VITE_API_URL`, the app uses **generated demo data** (`src/data/sampleScholarships.ts`,
684 fictional records) and the client-side matcher in `src/lib/matching.ts`, and shows a "Demo mode" banner.

## Data schema (for the scholarship spreadsheet)

Each scholarship maps to the `Scholarship` type:

| Column | Type | Example |
|---|---|---|
| `id` | string | `sch-0001` |
| `name` | string | `Future Innovators STEM Award` |
| `provider` | string | `The Horizon Foundation` |
| `amount` | number (USD) | `5000` |
| `amountMax` | number, optional | `10000` |
| `deadline` | `YYYY-MM-DD`, blank = rolling | `2027-03-01` |
| `categories` | list of category ids | `stem, immigrant` |
| `eligibleStatuses` | `all` or list of status ids | `citizen, permanent_resident, daca` |
| `states` | `national` or list of state codes | `CA, NV` |
| `grades` | list of `9`,`10`,`11`,`12`,`gap` | `11, 12` |
| `minGpa` | number, optional | `3.0` |
| `essay` | `none` / `short` / `long` | `short` |
| `fields` | optional list | `Engineering, Computer Science` |
| `circumstances` | optional list (required background) | `Military family` |
| `renewable` | boolean | `true` |
| `awardsCount` | number, optional | `25` |
| `description` | string | |
| `requirements` | list | `Transcript; 1 recommendation letter` |
| `url` | string | application link |

**Status ids:** `citizen`, `permanent_resident`, `daca`, `undocumented`, `tps`, `refugee_asylee`, `f1`,
`dependent_visa`, `other_visa`, `not_sure`

**Category ids:** `merit`, `need`, `stem`, `arts`, `community`, `leadership`, `athletics`, `first_gen`,
`identity`, `immigrant`, `local`, `no_essay`, `career`, `military`

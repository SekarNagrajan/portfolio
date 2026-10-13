# Sekar Nagarajan — Professional Portfolio

A modern, server-first portfolio for a full-stack software engineer. Built on
Next.js 15 (App Router) + React 19 Server Components with Tailwind v4,
Shadcn-style primitives, Motion (spring physics), Zod, and Nodemailer over
Gmail SMTP for the contact pipeline.

## Stack

| Layer           | Choice                                            |
| --------------- | ------------------------------------------------- |
| Framework       | Next.js 16 (App Router, Turbopack, Cache Components) |
| UI runtime      | React 19 Server Components + Server Actions       |
| Styling         | Tailwind CSS v4 with `@theme inline` oklch tokens |
| Primitives      | Shadcn-style (Radix Slot / Label) + CVA variants  |
| Motion          | `motion` package via `motion/react` (spring)      |
| Validation      | Zod                                               |
| Email           | Nodemailer over Gmail SMTP (465 SSL, pooled)      |
| Analytics       | `@vercel/analytics` + `@vercel/speed-insights`    |
| Icons           | Lucide (generics) + inline brand SVGs             |

## Routes

```
/            Hero + featured projects + signature stack
/about       Narrative + education + certifications
/skills      Grouped skill matrix with staggered reveal
/projects    4 interactive project cards (CRM, ANCHOR, PAMS E-Commerce, PAMS Legacy)
/experience  Server-rendered timeline (Solverminds employer context)
/resume      Embedded PDF preview + direct download
/contact     Zod-validated form over SMTP, progressive-enhancement
/api/og      Dynamic Open Graph image renderer (next/og ImageResponse)
/sitemap.xml Next.js auto-sitemap
/robots.txt  Next.js robots config
```

## Local setup

Prerequisites: Node 18.17+ (Node 20+ recommended), npm 10+.

```bash
# 1. Install
npm install

# 2. Copy env and fill in Gmail credentials (see below)
cp .env.example .env.local

# 3. Dev server
npm run dev
# -> http://localhost:3000
```

## Environment variables

| Variable                | Purpose                                               |
| ----------------------- | ----------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`  | Absolute origin — required for OG + sitemap           |
| `SMTP_HOST`             | `smtp.gmail.com`                                      |
| `SMTP_PORT`             | `465` (SSL) or `587` (STARTTLS)                       |
| `SMTP_SECURE`           | `true` for 465, `false` for 587                       |
| `SMTP_USER`             | Your Gmail address                                    |
| `SMTP_PASS`             | 16-character **Gmail App Password** (not account pwd) |
| `CONTACT_FROM`          | Sender address (must equal `SMTP_USER` for Gmail)     |
| `CONTACT_TO`            | Where inquiries are delivered (your inbox)            |

### Gmail App Password walkthrough

Gmail refuses the regular account password for SMTP. One-time setup:

1. Enable **2-Step Verification** on the Google Account — [myaccount.google.com/security](https://myaccount.google.com/security).
2. Open [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
3. Create an App Password named `Portfolio SMTP`. Copy the 16-char code.
4. Paste the code into `SMTP_PASS` in `.env.local`.
5. Restart `npm run dev`.

Common error if misconfigured:

```
535-5.7.8 Username and Password not accepted
```

That means `SMTP_PASS` is still the regular password — redo the App
Password flow above.

## Scripts

| Script          | Purpose                                            |
| --------------- | -------------------------------------------------- |
| `npm run dev`   | Start the Next.js dev server (Turbopack)           |
| `npm run build` | Production build with route pre-rendering          |
| `npm start`     | Serve the production build                         |
| `npm run lint`  | ESLint across the project                          |

## Architecture notes

- **Server-first.** Every page and layout is a Server Component. The only
  client leaves are `Navbar`, `Hero`, `SkillBadge`, `SkillGroupList`,
  `TimelineItem`, `ProjectCard`, `ResumeViewer`, `ContactForm`.
- **No data fetching hooks.** Static TypeScript modules in `src/lib/data/`
  are imported by Server Components. Zero runtime cost, zero bundle impact.
- **Server Actions.** `src/lib/actions/contact.ts` validates with Zod,
  checks a honeypot, and dispatches via a module-scoped Nodemailer pool
  (`src/lib/mailer.ts`, guarded by `import "server-only"`). The form uses
  `<form action={serverAction}>` so submissions still work with JavaScript
  disabled.
- **Motion.** Only `transform` + `opacity` are animated — hardware-accelerated
  on the GPU compositor so no browser reflows occur. `useReducedMotion` is
  wired into every interactive leaf and a CSS fallback strips animations
  entirely when the OS prefers reduced motion.
- **SEO.** `metadataBase` resolves absolute URLs. Every route exports
  `generateMetadata` via `buildMetadata()`, which points its OG image at
  `/api/og?title=...` — a `next/og` `ImageResponse` renderer. A `Person`
  JSON-LD schema is injected on the root layout.

## Resume PDF

The Word doc at
`C:/Users/Sekar Nagarajan/OneDrive/Documents/sekar resume/Sekar_Nagarajan_Resume.docx`
was exported to `public/resume.pdf`. To refresh after editing the DOCX:

```powershell
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("C:\Users\Sekar Nagarajan\OneDrive\Documents\sekar resume\Sekar_Nagarajan_Resume.docx", $false, $true)
$doc.SaveAs([ref]"P:\Sekar Portfolio\public\resume.pdf", [ref]17)
$doc.Close(); $word.Quit()
```

## Deployment — Vercel

1. **Push to GitHub.** Create a new empty GitHub repo, then from the
   project root:

   ```bash
   git add .
   git commit -m "feat: initial portfolio build"
   git remote add origin https://github.com/<you>/<repo>.git
   git branch -M main
   git push -u origin main
   ```

2. **Import to Vercel.** Visit [vercel.com/new](https://vercel.com/new),
   select the repo. Framework is auto-detected as Next.js.

3. **Environment variables** — add every row from `.env.example`
   (Production + Preview). Mark `SMTP_PASS` as encrypted / sensitive.

4. **First deploy.** Vercel builds, provisions, and surfaces a preview URL
   (`<project>.vercel.app`). SSL is automatic.

5. **Custom domain** — Project Settings → Domains → Add. Then update your
   registrar's DNS:
   - Root (`@`): A record → `76.76.21.21`
   - WWW: CNAME → `cname.vercel-dns.com`
   Vercel auto-provisions a Let's Encrypt certificate once DNS propagates.

6. **Analytics + Speed Insights.** Enabled automatically — the packages
   are wired into the root layout.

## Progressive enhancement check

To verify the contact form works without JavaScript:

1. Open DevTools → Command Palette → **Disable JavaScript**.
2. Reload `/contact`.
3. Fill in the form and submit — a full-page POST is performed to the
   Server Action, you're redirected back with the response. The toast
   won't fire (that needs JS), but the email is sent and the inline
   `aria-live` status updates.

## License

Personal portfolio — all rights reserved. Content copyright © Sekar
Nagarajan. Code structure provided as a reference pattern.

# Sekar Nagarajan — Professional Portfolio

A server-first portfolio for a full-stack software engineer. Built on
Next.js 16 (App Router, Cache Components) + React 19 Server Components with
Tailwind v4, Motion, Zod, and Nodemailer over Gmail SMTP for the contact
pipeline.

## Stack

| Layer           | Choice                                                        |
| --------------- | ------------------------------------------------------------- |
| Framework       | Next.js 16 (App Router, Turbopack, Cache Components)          |
| UI runtime      | React 19 Server Components + Server Actions                   |
| Styling         | Tailwind CSS v4, `@theme inline` oklch tokens, light/dark     |
| Motion          | `motion/react` — springs, scroll-linked effects, layout anims |
| Icons           | Custom animated SVG set + Simple Icons logos (CC0, vendored)  |
| Validation      | Zod (form schema + mail env config)                           |
| Email           | Nodemailer over Gmail SMTP (pooled, timeouts, typed errors)   |
| Analytics       | `@vercel/analytics` (+ custom events) + Speed Insights        |

## Routes

```
/                    Hero (logo orbit) + tabbed tech stack + featured work + capabilities
/about               Story, profile card, principles, education, certifications
/skills              Bento skill matrix by layer
/projects            Project cards → case studies
/projects/[slug]     Case study: problem → approach → architecture → impact → stack
/experience          Scroll-linked timeline
/resume              Embedded PDF preview + download
/contact             Zod-validated form → SMTP, rate-limited, auto-reply
/api/og              Dynamic Open Graph image (next/og, Geist font)
/icon, /apple-icon   Generated "SN" app icons
/manifest.webmanifest, /sitemap.xml, /robots.txt
```

Plus a custom 404 (`app/not-found.tsx`) and error boundary (`app/error.tsx`).

## Features

- **⌘K command palette** (`⌘K` / `Ctrl K` / `/`) — fuzzy search over pages,
  case studies, technologies, and actions (copy email, download CV, theme).
- **Theme** — dark / light / system, persisted, applied by an inline head
  script before first paint (no flash). Light accent tuned to WCAG AA.
- **Contact hardening** — honeypot, per-IP rate limit (3 / 10 min), and an
  auto-reply sent via `after()` (capped at 1 per recipient per day).
- **Security headers** — CSP, HSTS, `X-Frame-Options`, `nosniff`,
  `Referrer-Policy`, `Permissions-Policy` (see `next.config.ts`).
- **SEO** — per-route canonical + OG image, JSON-LD (`Person`,
  `ProfilePage`, `BreadcrumbList`, `CreativeWork` per case study).
- **Analytics events** — `cv_download`, `cv_open`, `cv_cta`,
  `contact_submitted`, `profile_click`, `case_study_open`, `email_copied`.
  Add `data-track="name"` (+ optional `data-track-label`) to any element.

## Editing content

| What                       | Where                                   |
| -------------------------- | --------------------------------------- |
| Name, links, availability  | `src/lib/data/profile.ts`               |
| Projects (cards)           | `src/lib/data/projects.ts`              |
| Case-study long form       | `src/lib/data/case-studies.ts`          |
| Home tech-stack tiles      | `src/lib/data/stack.ts`                 |
| Skill matrix               | `src/lib/data/skills.ts`                |
| Experience / education     | `src/lib/data/experiences.ts`, `education.ts` |
| Brand colours (non-CSS)    | `src/lib/brand.ts` (mirror of `globals.css` tokens) |

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
| `NEXT_PUBLIC_SITE_URL`  | Absolute origin — required for OG + sitemap. Falls back to `http://localhost:3000` when unset. |
| `SMTP_HOST`             | `smtp.gmail.com`                                      |
| `SMTP_PORT`             | `465` (SSL) or `587` (STARTTLS)                       |
| `SMTP_SECURE`           | `true` for 465, `false` for 587                       |
| `SMTP_USER`             | Your Gmail address                                    |
| `SMTP_PASS`             | 16-character **Gmail App Password** (not account pwd) |
| `CONTACT_FROM`          | Sender address (must equal `SMTP_USER` for Gmail)     |
| `CONTACT_TO`            | Where inquiries are delivered (your inbox)            |
| `CONTACT_FROM_NAME`     | Optional display name (default "Portfolio Contact")   |

`SMTP_SECURE` is optional — it defaults to `true` on port 465 and STARTTLS
otherwise. All mail variables are validated together on first use
(`src/lib/mailer/config.ts`), so a misconfiguration lists every bad field.

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
| `npm test`      | Unit tests for the contact schema, mail escaping, and rate limiter |
| `npm run mail:verify` | Open the SMTP connection without sending a message. Prints `mail: ok` or an error code such as `CONFIG` when `.env.local` is missing. |

## Architecture notes

- **Server-first.** Pages are Server Components that import static data
  from `src/lib/data/`. Interactivity lives in client leaves under
  `src/components/features`, `src/components/motion`, and
  `src/components/layout` (theme, palette, providers).
- **Mailer.** `src/lib/mailer/` — Zod-validated config, a pooled transport
  singleton (survives dev HMR), typed `MailerError`s, and `sendMail()`
  returning a result object instead of throwing. Templates in
  `src/lib/mailer/templates/`.
- **Server Action.** `src/lib/actions/contact.ts`: honeypot → Zod →
  rate limit → send → `after()` auto-reply. Works with JavaScript disabled.
- **Motion.** Transform/opacity/filter/pathLength only. Animated icons
  respond to `hidden` / `rest` / `hover` variant labels cascading from a
  parent (`hoverTrigger` / `revealTrigger` in `src/lib/motion.ts` — kept
  out of `"use client"` files so Server Components can spread them).
  `MotionConfig reducedMotion="user"` + a CSS fallback honour the OS setting.
- **Rate limiting** is in-memory per server instance (`src/lib/rate-limit.ts`).
  For multi-instance hosting, back it with Upstash Redis / Vercel KV.

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

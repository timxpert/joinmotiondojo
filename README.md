# Motion Dojo

The main brand and community website for Motion Dojo — where motion designers come to grow together.

Built with Next.js 15 (App Router) and plain CSS (`src/app/globals.css`).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Updating links — `src/config/site.ts`

| Setting | What it controls |
| --- | --- |
| `COMMUNITY_JOIN_URL` | Every "Join the community" / "Join Motion Dojo" button |
| `COURSE_URL` | "Explore the course" (Black Belt in Motion Design) |
| `DOJO_AI_URL` | Footer link to Dojo’s AI. Hidden while it’s empty (the homepage no longer has a Dojo’s AI tile) |
| `NINJAS_SHOWCASE_URL` | Footer link to the Keyframe Ninjas showcase |
| `SOCIAL_LINKS` | Footer social links |
| `CONTACT` | Footer contact details (hidden while empty) |
| `NAV` | Header, mobile menu and footer navigation |

## Updating content — `src/data/content.ts`

- **`TESTIMONIALS`** — video testimonials supplied by the team (Vimeo links).
- **`COURSE_PHASES`** — the four Black Belt phases.

## Homepage sections (in order)

Hero + 16:9 reel → Introduction → Meet the team → What's inside the dojo → Black Belt in Motion Design → The community → Testimonials → Final call to action → Footer.

## Course page — `/blackbelt`

Black Belt in Motion Design has its own page at `/blackbelt` (`src/app/blackbelt/page.tsx`). Links to it from the homepage open it in a new tab. Course copy, curriculum, sample projects, pricing and FAQs live in `src/data/blackbelt.ts`.

Payment uses Paystack. Only the **public** key is in the code (`ENROL.paystackPublicKey`). Before going live:

1. In Vercel → this project → Settings → Environment Variables, add `PAYSTACK_SECRET_KEY` (never commit it).
2. In the Paystack dashboard, set the webhook URL to `https://<your domain>/api/paystack-webhook`.
3. To serve the page at `joinmotiondojo.com/blackbelt`, add `joinmotiondojo.com` as a domain of this Vercel project.

Payments are confirmed on the server by `/api/verify-payment` (₦40,000, NGN) before the visitor sees "Payment received".

## Motion Dojo Connect

Connect lives in its own repo: [timxpert/connect](https://github.com/timxpert/connect).

This site still feeds it: when a course payment succeeds, the Paystack webhook (`src/app/api/paystack-webhook`) records the student's email in Connect's Supabase `enrolments` table, which turns on their Keyframe Ninja badge. For that, set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in this Vercel project to the same Supabase project Connect uses. Without them, the webhook skips this step.

## Fonts

Sora (Google Fonts) for text and Clash Display (Fontshare) for headings, both loaded in `src/app/layout.tsx`.

## Motion

The logo reel under the hero is the only thing that moves on its own. Nothing animates on scroll. Hover states change colour only. All motion is off for visitors who prefer reduced motion. Styles are at the end of `globals.css`.

## Design context

`PRODUCT.md` records who the site is for, the brand commitments and what content must not be invented. Design tools such as Impeccable read it.

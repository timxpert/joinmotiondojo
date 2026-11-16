# Product

## Motion Dojo in the team's own words (source of truth for copy)

Motion Dojo is a community built for smartphone motion designers and creative enthusiasts who want to learn, improve, connect, and grow together. It's more than a place to learn how to animate: an environment where creatives don't have to figure everything out alone, where they develop skills, discover their potential, share ideas, get feedback, collaborate, and build confidence.

Built around three things:
- **Learning**: understanding motion design, mastering tools, strong creative foundations.
- **Community**: like-minded creatives who learn from, support, challenge, and inspire one another.
- **Growth**: moving beyond tutorials to meaningful work, portfolios, and opportunities.

What makes it different: growth shouldn't be limited by the tools you use or by learning alone. From first steps in Alight Motion to impressive projects, there's room to improve, experiment, and connect.

Names:
- **Motion Dojo**: the community.
- **Black Belt in Motion Design**: the course (structured, guided training for members who want it).
- **Keyframe Ninjas**: students enrolled in the course.

The bigger picture: not just teaching people to animate, but building a community of creatives who grow together.

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Nigerian motion designers, aspiring creatives and international creatives, most of them on smartphones. Many animate on their phones in Alight Motion. They arrive wanting to know what Motion Dojo is, whether they belong there, and how to join.

## Product Purpose

The main brand and community website for Motion Dojo. It is not a course sales page. It should make visitors feel they belong, explain the ecosystem in plain words, and send them to join the community. Success means a visitor understands what Motion Dojo is, who it is for, what they can do inside, what Black Belt in Motion Design and Dojo's AI are, and how to join.

## Positioning

Motion Dojo is a community where motion designers grow together through learning, practice, feedback and shared progress. The central message is "You were never meant to figure it all out alone."

## Operating Context

The site is part of one ecosystem with four identities:

- **Motion Dojo**: the parent brand and community.
- **Black Belt in Motion Design**: the structured course, on its own site (joinmotiondojo.vercel.app). Four phases: Foundations, Tool Mastery, Creative Execution, Portfolio & Mastery.
- **Keyframe Ninjas**: the name for students enrolled in Black Belt. An identity, not a product. Introduced only where students appear.
- **Dojo's AI**: an in-house tool built for community members. Not a course or a separate community.

Joining currently happens through the Black Belt site, where the community manager gives access after payment.

## Capabilities and Constraints

- Next.js 15 (App Router), plain CSS, deployed on Vercel.
- All outbound links live in `src/config/site.ts`; editable content lives in `src/data/content.ts`.
- Dojo's AI URL, features, screenshots and demo are not supplied yet. Do not invent them.
- No dedicated community invite URL yet.
- Contact email and WhatsApp are not supplied yet.

## Brand Commitments

- Palette: Dojo Midnight #140A2E, Motion Violet #6D32E8, Electric Lavender #A77BFF, Kinetic Lime #C8FF3D, White #F7F5FF. Light backgrounds about 80% of the time, Midnight for selected sections, Lime sparingly.
- Type: Plus Jakarta Sans for everything (headings and text).
- Personality: minimal, editorial, premium, expressive, motion-inspired, modern, community-driven.
- Visual language comes from motion design itself: keyframes, motion paths, timelines, graph-editor curves. The dojo idea shapes the philosophy, not the imagery: no martial-arts clichés, Japanese symbols or samurai graphics.
- Voice: simple, clear, short sentences, no jargon or corporate language. Introduce the benefit before the product or identity name.
- Primary call to action: Join the community.

## Evidence on Hand

- Team photos: `public/assets/` (Timxpert, founder; Muhammad Fatihi Abdullahi, community manager; Osho Elizabeth Oluwatobiloba, moderator; George Junior, social media manager).
- Video testimonials on Vimeo from Mary (Cohort 01), Roseline Ibironke (Cohort 02) and Muhammad Fatihi (Cohort 02), with stills in `public/images/testimonial-*.webp`.
- Logo reel `public/videos/hero.mp4` and an Alight Motion phone screenshot `public/images/about-visual.webp`.
- No real community event photos, statistics, press, or other member profiles yet. The student profiles in `students_data.json` are samples. Do not fabricate testimonials, achievements, member profiles or numbers.

## Product Principles

1. Belonging first: the page should feel like an invitation to a community, never a checkout.
2. One ecosystem: Motion Dojo is the parent; the course and the tool belong to it.
3. Truth over filler: only real people, real work and real words from the team.
4. Plain words: say what things are and do, for a reader on a phone.

## Accessibility & Inclusion

Mobile-first; touch targets of at least 44px; text contrast of at least 4.5:1; body text of at least 16px; respect reduced-motion preferences.

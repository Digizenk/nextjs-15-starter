# Digizenk website

Bilingual (English / Spanish) site for Digizenk: AI prompt guides, a shop that links to Etsy and Hotmart, and a free prompt pack that builds the email list.

Built with Next.js 16, Tailwind CSS, next-intl and MDX. Started from the MIT-licensed [Next Forge](https://github.com/weijunext/nextjs-starter) template.

## Run it locally

Requires Node.js 20.9+ and pnpm.

```bash
corepack enable
pnpm install
cp .env.example .env
pnpm dev
```

Open http://localhost:3000 (English) or http://localhost:3000/es (Spanish).

## Where things live

| What | Where |
|---|---|
| Site name, tagline, domain | `config/site.ts` and `NEXT_PUBLIC_SITE_URL` in `.env` |
| Products and their Etsy / Hotmart links | `config/products.ts` |
| All interface text, both languages | `i18n/messages/en.json`, `i18n/messages/es.json` |
| Guides (blog posts) | `blogs/en/*.mdx`, `blogs/es/*.mdx` |
| About, Privacy, Terms | `content/<page>/<en\|es>.mdx` |
| Colors and fonts | `styles/globals.css`, `tailwind.config.ts` |

## Writing a guide

Create `blogs/en/my-guide.mdx` (and the Spanish version in `blogs/es/`):

```markdown
---
title: 50 ChatGPT Prompts for Real Estate Agents
description: Copy-ready prompts for listings, follow-ups and social posts.
slug: /chatgpt-prompts-real-estate
date: 2026-11-05
visible: published
---

Your content here…
```

`visible` can be `published`, `draft` or `invisible`. Set `pin: true` to keep a guide at the top.

## Email sign-ups

The free-pack form uses [Resend](https://resend.com). Add `RESEND_API_KEY`, `ADMIN_EMAIL` (on a domain verified in Resend), `RESEND_AUDIENCE_ID`, `FREE_PACK_URL` and `UNSUBSCRIBE_SECRET` to `.env`. Until then the site works and the form says sign-ups aren't on yet.

[Upstash](https://upstash.com) rate limiting is optional; add its two keys to block sign-up spam.

## Deploy

Push to GitHub and import the repo in [Vercel](https://vercel.com), or any host that runs Next.js. Copy your `.env` values into the host's environment variables.

```bash
pnpm build
pnpm start
```

## License

MIT

# Devault — Claude Context

## What this project is
Personal bookmark manager. Save, search, and organize links.

## Running
- **Mode:** Production (`next start`)
- **Port:** 3000
- **Started by:** claude user via nohup
- **URL:** https://devault.heyturgay.com (Cloudflare tunnel)
- **Tunnel config:** /root/.cloudflared/devault-config.yml (ID: 6c600874-cefa-4e59-abf6-2d9bb9475579)

## Stack
- Next.js 16 App Router, TypeScript
- SQLite database (`devault.db`)
- Vanilla CSS (`app/globals.css`)
- Cookie-based auth

## Auth
- Cookie name: `devault-auth`
- Middleware: `middleware.ts` (project root)
- `secure: false` on cookie — Cloudflare terminates SSL before Node.js
- Credentials in `.env.local` (not committed)

## Key files
- `app/page.tsx` — main bookmarks page with logout button
- `app/api/bookmarks/route.ts` — CRUD API
- `app/login/page.tsx` — login form (checks `res.ok` then redirects to `/`)
- `app/api/auth/login/route.ts` — sets cookie
- `app/api/auth/logout/route.ts` — clears cookie
- `public/favicon.svg` — custom favicon

## Restart after build
```bash
pkill -f "devault" 2>/dev/null
cd /home/repos/devault && PORT=3000 nohup node_modules/.bin/next start > /home/claude/devault.log 2>&1 &
```

## Analytics
- Umami self-hosted at https://umami.heyturgay.com
- Tracking script in app/layout.tsx (data-website-id: 8efb473c-bb85-484c-acc7-33d412b9b335)

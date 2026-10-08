# ACO website (yugatime.space)

One-page landing site for **ACO — Artificial Cognitive Organism**: "The AI that never forgets and keeps getting smarter."
Plain HTML/CSS/JS. No build step. Works on GitHub Pages, Render (Static Site) or Hostinger.

## Files
- `index.html` — the page (all text lives here)
- `styles.css` — look and layout (dark indigo/violet, Poppins)
- `main.js` — background animation, scroll effects, waitlist form
- `config.js` — **the only settings file** (waitlist address + contact email)
- `favicon.svg`, `assets/` — logo mark, icons, social-share image (`og-image.png`)
- `robots.txt`, `sitemap.xml`, `site.webmanifest` — search engine / phone basics

## Waitlist form
Edit `config.js`:
- `WAITLIST_ENDPOINT: ""` — while empty, the form opens the visitor's email app with their details
  (sent to `CONTACT_EMAIL`, or the placeholder `email@example.com` if that is empty).
- Set it to the ACO app's address later, e.g. `"https://app.yugatime.space/api/waitlist"`.
  The form sends `POST` JSON `{ name, email, use, source, page, submittedAt }` and shows a thank-you
  message on any 2xx reply. The endpoint must allow CORS from the site's domain (or be on the same domain).
- `CONTACT_EMAIL: ""` — fill in once a domain email exists (e.g. hello@yugatime.space); the footer shows `[email]` until then.

## Preview locally
```
cd aco-site && python3 -m http.server 8090
```
Open http://localhost:8090

## Going live (summary)
1. Push this folder to a GitHub repository (free account).
2. Either: GitHub → Settings → Pages → deploy from `main` branch, root folder;
   or: Render → New → Static Site → connect the repo, publish directory `.` (no build command).
3. Add the custom domain `yugatime.space` in GitHub Pages / Render, then in Hostinger → Domains → DNS
   add the records they show (GitHub Pages: four A records for `@` + CNAME `www` → `<user>.github.io`;
   Render: the A/CNAME records shown in its Custom Domains screen). HTTPS is issued automatically.

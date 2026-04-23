# Portfolio site — Sayeed Mehrjerdian

A single-page portfolio site. Pure HTML/CSS/JS — no build step, no dependencies.
Works out of the box on GitHub Pages.

## Files

- `index.html` — all site content
- `styles.css` — hunter-green + camo aesthetic
- `script.js` — scroll reveal, active nav, subtle card tilt

## Run locally

Any static server works. Two zero-dependency options:

```bash
# Option 1: Python
python3 -m http.server 4000
# then open http://localhost:4000

# Option 2: Node (one-off, no install)
npx serve .
```

## Deploy to GitHub Pages

### One-time setup

1. Create a new repo on GitHub. Two naming options:
   - **Recommended:** name it `<your-username>.github.io` — this gives you a
     root URL like `https://atownbrown.github.io`. One of these per account.
   - Or name it anything (e.g. `portfolio`) and GitHub will host it at
     `https://<your-username>.github.io/portfolio/`.

2. From this folder, on your terminal:

   ```bash
   git init
   git add .
   git commit -m "initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo>.git
   git push -u origin main
   ```

3. On GitHub, open the repo → **Settings** → **Pages**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` / `(root)`
   - Save.

4. Wait ~30–60 seconds. The site will be live at the URL GitHub shows you.

### Updating the site

```bash
# edit files, then:
git add .
git commit -m "update copy"
git push
```

GitHub Pages redeploys automatically.

### Custom domain (optional)

If you have a domain (e.g. `sayeed.work`):

1. In the repo, add a file named `CNAME` containing just `sayeed.work`.
2. In your DNS provider, point the domain to GitHub Pages (A records or
   CNAME — GitHub docs walk through the exact values).
3. In **Settings → Pages**, enter the custom domain and check
   "Enforce HTTPS" once the cert provisions (can take a few minutes).

## If you ever want to upgrade to Next.js later

GitHub Pages only serves static files, which is fine for this site. If you
outgrow that and want a framework:

- **Vercel** (free tier) — native Next.js, push from GitHub, auto deploys.
- **Cloudflare Pages** (free) — also great, fast CDN, supports Next.js.
- **Netlify** (free tier) — similar to Vercel.

For this particular site, static is the right call. It loads instantly,
costs nothing, and needs no maintenance.

## Editing content

All copy lives in `index.html`. Search for the section comments (e.g.
`<!-- HERO -->`, `<!-- FOUNDATION -->`, `<!-- METASEED CLIENT WALL -->`)
to find what you want to edit.

## Notes on copy that may need review

Claude drafted the **Emerge / Emergibles** and **Capacitr** sections from
context clues in other files. Verify the positioning and tweak the copy
to match how you'd describe the products yourself.

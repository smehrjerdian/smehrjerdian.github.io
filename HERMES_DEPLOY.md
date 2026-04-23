# Hermes brief — publish portfolio to GitHub Pages (unindexed preview)

**Owner:** Sayeed Mehrjerdian (`smehrjerdian`)
**Source path:** `/Users/smehrjerdian/Desktop/Sayeed/Resume/portfolio-site`
**Target:** `https://smehrjerdian.github.io/portfolio-site/`

## Goal

Publish the static site at the source path to GitHub Pages. The site MUST go live at the Pages URL but MUST NOT get indexed by Google, Bing, or any AI training crawler while it's in preview. I want to be able to share the link directly without it showing up in search.

## What's already in the repo

Before you start, know that the following no-index protections are already baked into the site. You do not need to add them — just don't remove them.

1. **`<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">`** in `index.html` head (plus explicit `googlebot` and `bingbot` variants).
2. **`robots.txt`** at the site root disallowing `/` for all user-agents, with explicit entries for Googlebot, Bingbot, GPTBot, CCBot, ClaudeBot, anthropic-ai, and PerplexityBot.
3. **`.nojekyll`** at the root so GitHub Pages serves the files as-is instead of running Jekyll.
4. **`.gitignore`** already excludes `.DS_Store`, `node_modules/`, editor junk.

## Steps

### 1 — Initialize git and commit

```bash
cd /Users/smehrjerdian/Desktop/Sayeed/Resume/portfolio-site
git init -b main
git add .
git status   # sanity check — should NOT list .DS_Store or editor files
git commit -m "Initial commit: portfolio v2026 (unindexed preview)"
```

### 2 — Create the remote repo

Use the GitHub CLI (authenticate first if needed: `gh auth status`, `gh auth login`).

```bash
gh repo create smehrjerdian/portfolio-site \
  --public \
  --description "Personal portfolio — Sayeed Mehrjerdian (Atown). Preview; noindex active." \
  --source=. \
  --remote=origin \
  --push
```

`--public` is required because free-tier GitHub Pages only serves from public repos. If Sayeed has GitHub Pro, we can use `--private` instead — confirm with him before flipping this.

If `gh repo create --push` fails for any reason, fall back to:

```bash
git remote add origin https://github.com/smehrjerdian/portfolio-site.git
git push -u origin main
```

### 3 — Enable GitHub Pages

Via the API (preferred, no browser needed):

```bash
gh api --method POST \
  -H "Accept: application/vnd.github+json" \
  /repos/smehrjerdian/portfolio-site/pages \
  -f "source[branch]=main" \
  -f "source[path]=/"
```

First build takes 1–3 minutes. Poll until the site is live:

```bash
# Check build status
gh api /repos/smehrjerdian/portfolio-site/pages/builds/latest --jq '.status'
# Should eventually return: "built"
```

### 4 — Verify the deploy

```bash
# Site responds
curl -sI https://smehrjerdian.github.io/portfolio-site/ | head -1
# Expect: HTTP/2 200

# robots.txt is being served and blocks everyone
curl -s https://smehrjerdian.github.io/portfolio-site/robots.txt | head -5
# Expect: Disallow: /

# noindex meta is present
curl -s https://smehrjerdian.github.io/portfolio-site/ | grep -i 'name="robots"'
# Expect: <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
```

If any of those three checks fails, stop and debug before declaring success.

### 5 — Report back

Print out:
- The live URL (`https://smehrjerdian.github.io/portfolio-site/`).
- Confirmation that all three verification checks passed.
- The commit SHA of the initial commit.

## Important — things NOT to do

- Do NOT remove, modify, or comment out any of the four no-index assets (`<meta name="robots">`, `robots.txt`, `.nojekyll`, `.gitignore`).
- Do NOT push any files from `/Users/smehrjerdian/Desktop/Sayeed/` outside of the `Resume/portfolio-site` directory. Stay inside the source path.
- Do NOT commit `.DS_Store` or any `.env` file. If `git status` shows anything suspicious, pause and ask.
- Do NOT set up a custom domain in this pass. That's a separate future step.
- Do NOT force-push. If the first commit has a problem, create a new commit to fix it.

## When ready to launch publicly (future step — do NOT do now)

When Sayeed says "flip to public," you'll need to:
1. Remove the `<meta name="robots">`, `<meta name="googlebot">`, and `<meta name="bingbot">` tags from `index.html`.
2. Replace `robots.txt` contents with a permissive version (`User-agent: *` / `Allow: /`), optionally keeping the AI crawler blocks.
3. Commit with message `"Launch: remove noindex, allow crawling"` and push.
4. Submit the sitemap to Google Search Console.

But only when he explicitly asks. Until then, everything stays under noindex.

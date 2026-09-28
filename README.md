# devlsj.github.io

Personal profile page in the style of a classic Tumblr profile theme: banner, round avatar, section tabs,
a sidebar (bio · now · stack · obsessions) and a feed of project "cards" driven by the GitHub API.
Plain HTML/CSS/JS, no build step.

## Customize

| What | Where |
| --- | --- |
| Name, bio, nav links, tabs, stack list, obsessions, about text, per-repo card copy | `js/config.js` |
| Colors, fonts, spacing | `css/style.css` (`:root` tokens at the top); placeholder art colors in `scripts/gen_placeholders.py` |
| Banner art (1200×480+) | drop `assets/banner.jpg` — the pastel placeholder shows until then |
| Avatar (square) | drop `assets/avatar.png` — falls back to `assets/avatar-placeholder.svg` |
| Illustration beside "about me" | drop `assets/about.png` — falls back to `assets/about-placeholder.svg` |
| Optional full-body cut-out next to the avatar | drop a transparent `assets/chibi.png` |
| Optional per-project cover image | put the file under `assets/covers/` and set `repoMeta["<repo>"].cover` in `js/config.js` |

## Data

Repositories and activity are fetched from `api.github.com` on page load (cached 10 min in `localStorage`).
If the API is unreachable or rate-limited the page falls back to the snapshots in `data/`. Refresh them with:

```sh
gh api "users/DevLSJ/repos?sort=pushed&per_page=100" --jq '[.[] | {name, full_name, html_url, description, language, topics, stargazers_count, forks_count, size, fork, archived, homepage, created_at, pushed_at, updated_at}]' > data/repos.json
gh api "users/DevLSJ/events/public?per_page=30" --jq '[.[] | {id, type, created_at, repo: .repo.name, payload: {ref: .payload.ref, ref_type: .payload.ref_type, action: .payload.action, size: .payload.size, commits: ([.payload.commits[]?.message] | .[0:3]), pr_title: .payload.pull_request.title, pr_number: .payload.pull_request.number}}]' > data/events.json
```

## Run locally

Open `index.html` directly, or `python3 -m http.server 8080` and visit <http://localhost:8080>.

## Deploy

GitHub Pages serves the `main` branch of `DevLSJ/DevLSJ.github.io` at <https://devlsj.github.io>. Push to publish.

/* DevLSJ.github.io — renders config.js and the GitHub API into the tumblr-style layout.
   Live data comes from api.github.com (unauthenticated, cached 10 min in localStorage);
   data/*.json snapshots are used when the API is unavailable or rate-limited. */
(() => {
  const S = window.SITE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const icon = (n, cls = "ic") => `<svg class="${cls}"><use href="#i-${n}"/></svg>`;
  const API = `https://api.github.com/users/${S.login}`;

  // ── dates in the theme's "August 1, 2018 at 12:00 PM" style ──
  const fmtDate = (iso) => {
    const d = new Date(iso);
    if (isNaN(d)) return "";
    const date = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `${date} at ${time}`;
  };
  const fmtShort = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const ago = (iso) => {
    const s = (Date.now() - new Date(iso)) / 1000;
    const u = [["y", 31536000], ["mo", 2592000], ["d", 86400], ["h", 3600], ["m", 60]];
    for (const [k, n] of u) if (s >= n) return `${Math.floor(s / n)}${k} ago`;
    return "just now";
  };

  // ── fetch with cache + snapshot fallback ──
  async function load(key, url, fallback) {
    const ck = `devlsj:${key}`;
    try {
      const c = JSON.parse(localStorage.getItem(ck) || "null");
      if (c && Date.now() - c.t < 10 * 60 * 1000) return { data: c.d, source: "cache" };
    } catch {}
    try {
      const r = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
      if (!r.ok) throw new Error(`${r.status}`);
      const d = await r.json();
      try { localStorage.setItem(ck, JSON.stringify({ t: Date.now(), d })); } catch {}
      return { data: d, source: "live" };
    } catch (e) {
      const r = await fetch(fallback);
      return { data: await r.json(), source: "snapshot" };
    }
  }

  // ── static parts ──
  function renderStatic() {
    document.title = S.name;
    $("#topnav").innerHTML = S.nav.map((n) =>
      `<a href="${esc(n.href)}"${/^https?:/.test(n.href) ? ' target="_blank" rel="noopener"' : ""}>${icon(n.icon, "")}${esc(n.label)}</a>`).join("");
    const f = $("#followBtn"); f.textContent = S.follow.label.toUpperCase(); f.href = S.follow.href; f.target = "_blank"; f.rel = "noopener";
    $("#tabs").innerHTML = S.tabs.map((t, i) => `<a href="${esc(t.href)}" class="${i === 0 ? "on" : ""}">${esc(t.label)}</a>`).join("");
    $("#tabs").addEventListener("click", (e) => {
      const a = e.target.closest("a"); if (!a) return;
      $("#tabs").querySelectorAll("a").forEach((x) => x.classList.toggle("on", x === a));
    });
    $("#name").textContent = S.name;
    const h = $("#handle"); h.textContent = S.handle; h.href = S.follow.href;
    $("#tagline").textContent = S.tagline;
    $("#bio").innerHTML = S.bio;
    $("#joined").textContent = S.joined;
    $("#nowTitle").textContent = S.now.title;
    $("#nowBody").innerHTML = S.now.html;
    $("#viewAllStack").href = `https://github.com/${S.login}?tab=repositories`;
    $("#viewAllRepos").href = `https://github.com/${S.login}?tab=repositories`;
    $("#stackList").innerHTML = S.stack.map((s) => `
      <li><span class="av" style="--c:${esc(s.color)}">${esc(s.name[0])}</span>
        <span class="txt"><span class="nm">${esc(s.name)}</span><span class="hd">${esc(s.handle)}</span><br><span class="pill">${esc(s.pill)}</span></span>
        ${icon("x", "x")}</li>`).join("");
    $("#tagList").innerHTML = S.obsessions.map((o) => `<li><span class="t">${esc(o.tag)}</span><span class="s">${esc(o.sub)}</span></li>`).join("");
    $("#aboutBody").innerHTML = S.about.html;
    $("#aboutDate").textContent = fmtDate(S.about.date);
    $("#footText").textContent = S.footer;
  }

  // ── project cards ("character cards") ──
  let repos = [];
  function cardHTML(r) {
    const m = S.repoMeta[r.name] || {};
    const lang = r.language || "—";
    const color = S.langColors[r.language] || "#dcc7f1";
    const title = m.title || (r.description ? r.description.slice(0, 32) : "public repository");
    const cover = m.cover || "";                  // optional per-repo art, e.g. repoMeta["x"].cover = "assets/covers/x.png"
    const pushed = r.pushed_at ? fmtShort(r.pushed_at) : "";
    return `<a class="card" href="${esc(r.html_url)}" target="_blank" rel="noopener" data-q="${esc(`${r.name} ${r.description || ""} ${lang} ${m.type || ""} ${m.stack || ""}`.toLowerCase())}">
      <div class="cover" style="--c:${color}"><span>${esc(r.name[0].toUpperCase())}</span>${cover ? `<img src="${esc(cover)}" alt="" onerror="this.remove()">` : ""}</div>
      <div class="body">
        <div class="hdr"><span class="nm">${esc(r.name)}</span><span class="ttl" title="${esc(r.description || "")}">${esc(title)}</span></div>
        <div class="rows">
          <span><b>Language:</b> ${esc(lang)}</span>
          <span><b>Type:</b> ${esc(m.type || (r.archived ? "Archived" : "Repository"))}</span>
          <span><b>Stack:</b> ${esc(m.stack || (r.topics && r.topics.length ? r.topics.join(" · ") : lang))}</span>
          <span><b>Status:</b> ${r.archived ? "archived" : `active · ${esc(ago(r.pushed_at))}`}</span>
        </div>
      </div>
      <div class="stats">
        <span>${icon("heart")}${r.stargazers_count} stars</span>
        <span>${icon("repeat")}${r.forks_count} forks</span>
        <span>${icon("mic")}${esc(pushed)}</span>
        ${r.homepage ? `<span>${icon("link")}${esc(r.homepage.replace(/^https?:\/\//, ""))}</span>` : ""}
      </div>
    </a>`;
  }
  function renderRepos() {
    const box = $("#repoCards");
    if (!repos.length) { box.innerHTML = `<p class="empty">no public repositories yet.</p>`; return; }
    box.innerHTML = repos.map(cardHTML).join("");
    const notes = repos.reduce((n, r) => n + r.stargazers_count + r.forks_count, 0);
    $("#repoNotes").textContent = `${notes} notes`;
    $("#aboutNotes").textContent = `${repos.length} projects`;
    $("#repoDate").textContent = fmtDate(repos[0].pushed_at);
    applySearch();
  }
  async function loadRepos(force = false) {
    if (force) localStorage.removeItem("devlsj:repos");
    const { data, source } = await load("repos", `${API}/repos?sort=pushed&per_page=100`, "data/repos.json");
    repos = (Array.isArray(data) ? data : [])
      .filter((r) => !S.hiddenRepos.includes(r.name) && !(S.hideForks && r.fork))
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
    renderRepos();
    if (source === "snapshot") $("#repoDate").textContent += " · snapshot";
  }
  function applySearch() {
    const q = $("#q").value.trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll("#repoCards .card").forEach((c) => { const hit = !q || c.dataset.q.includes(q); c.hidden = !hit; shown += hit; });
    let e = $("#repoCards .empty");
    if (!shown && repos.length) { if (!e) { e = document.createElement("p"); e.className = "empty"; e.textContent = "nothing matches that search."; $("#repoCards").appendChild(e); } }
    else if (e) e.remove();
  }

  // ── activity ──
  const EV = {
    PushEvent: (e) => {
      const n = e.payload.size ?? (e.payload.commits || []).length;
      const c0 = (e.payload.commits || [])[0];
      const branch = (e.payload.ref || "").replace("refs/heads/", "");
      return { i: "commit", what: n ? `pushed ${n} commit${n === 1 ? "" : "s"} to` : "pushed to", sub: (c0 && (c0.message || c0)) || (branch ? `branch ${branch}` : "") };
    },
    CreateEvent: (e) => ({ i: "plus", what: `created ${e.payload.ref_type}${e.payload.ref ? ` ${e.payload.ref}` : ""} in`, sub: "" }),
    DeleteEvent: (e) => ({ i: "trash", what: `deleted ${e.payload.ref_type} ${e.payload.ref} in`, sub: "" }),
    PullRequestEvent: (e) => ({ i: "pr", what: `${e.payload.action} pull request #${e.payload.pr_number || e.payload.pull_request?.number || ""} in`, sub: e.payload.pr_title || e.payload.pull_request?.title || "" }),
    IssuesEvent: (e) => ({ i: "plus", what: `${e.payload.action} an issue in`, sub: e.payload.issue?.title || "" }),
    WatchEvent: (e) => ({ i: "star", what: "starred", sub: "" }),
    ForkEvent: (e) => ({ i: "fork", what: "forked", sub: "" }),
  };
  let eventsLoaded = false;
  async function loadEvents() {
    if (eventsLoaded) return; eventsLoaded = true;
    const { data, source } = await load("events", `${API}/events/public?per_page=30`, "data/events.json");
    const list = (Array.isArray(data) ? data : []).map((e) => {
      const f = EV[e.type]; if (!f) return "";
      const repo = typeof e.repo === "string" ? e.repo : e.repo?.name || "";
      const v = f(e);
      const sub = typeof v.sub === "string" ? v.sub.split("\n")[0] : "";
      return `<li><span class="ev">${icon(v.i, "")}</span>
        <span class="what">${esc(v.what)} <a href="https://github.com/${esc(repo)}" target="_blank" rel="noopener">${esc(repo.replace(`${S.login}/`, ""))}</a>${sub ? `<span class="sub">${esc(sub)}</span>` : ""}</span>
        <time datetime="${esc(e.created_at)}" title="${esc(fmtDate(e.created_at))}">${esc(ago(e.created_at))}</time></li>`;
    }).filter(Boolean);
    $("#eventList").innerHTML = list.join("") || `<li class="loading">no recent public activity.</li>`;
    $("#eventSource").textContent = source === "snapshot" ? "github public events · snapshot" : "github public events · live";
  }

  // ── wiring ──
  renderStatic();
  loadRepos();
  $("#q").addEventListener("input", applySearch);
  $("#refreshRepos").addEventListener("click", (e) => { e.preventDefault(); $("#repoCards").innerHTML = `<p class="loading">refreshing…</p>`; loadRepos(true); });
  document.querySelectorAll(".feedtabs button").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll(".feedtabs button").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); });
    $("#feed-projects").hidden = b.dataset.feed !== "projects";
    $("#feed-activity").hidden = b.dataset.feed !== "activity";
    if (b.dataset.feed === "activity") loadEvents();
  }));
})();

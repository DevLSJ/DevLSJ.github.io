// ─────────────────────────────────────────────────────────────
//  Everything you will normally want to edit lives in this file.
//  Text fields accept a little HTML (<b>, <i>, <a>, <span class="hl">).
// ─────────────────────────────────────────────────────────────
window.SITE = {
  login: "DevLSJ",
  name: "DevLSJ",
  handle: "@DevLSJ",
  tagline: "Junior Developer | CSW Major | UTC+9",
  bio: "Kotlin으로 모바일을, Java·TypeScript로 웹을, Python으로 탐지 서비스를 만듭니다. 요즘은 <b>eBPF</b>와 <b>Linux 커널</b>, <b>공급망 보안</b>에 빠져 있습니다. Building things from the kernel up.",
  joined: "Joined October 2024",

  // top bar (HOME · TWITTER · TUMBLR · DEVIANTART in the original theme)
  nav: [
    { label: "Home", href: "./", icon: "home" },
    { label: "GitHub", href: "https://github.com/DevLSJ", icon: "github" },
    { label: "Capstone", href: "https://github.com/DevLSJ/eBPF-Trace", icon: "linux" },
    { label: "Profile", href: "https://github.com/DevLSJ#readme", icon: "user" },
  ],
  follow: { label: "Follow", href: "https://github.com/DevLSJ" },

  // section tabs under the banner
  tabs: [
    { label: "Posts", href: "#feed" },
    { label: "Projects", href: "#projects" },
    { label: "About", href: "#about" },
    { label: "Stack", href: "#stack" },
    { label: "Obsessions", href: "#obsessions" },
  ],

  // "Layout" box in the original theme
  now: {
    title: "Now",
    html: "<p>2026 캡스톤 <b>eBPF-Trace</b>: 리눅스 커널 레벨에서 공급망 공격을 탐지하는 시스템을 만들고 있습니다.</p><p>eBPF 프로브로 커널 이벤트를 모으고, 탐지 규칙과 ML 모델로 판별한 뒤, 대응 에이전트와 React 대시보드까지 한 흐름으로 잇는 중입니다.</p>",
  },

  // "Best Friends" box → tech stack. pill = relationship label, color = avatar circle.
  stack: [
    { name: "Kotlin",     handle: "@android",      pill: "daily",    color: "#b79cf0" },
    { name: "Java",       handle: "@spring",       pill: "daily",    color: "#e8b088" },
    { name: "Python",     handle: "@fastapi",      pill: "daily",    color: "#9fbde6" },
    { name: "TypeScript", handle: "@react",        pill: "daily",    color: "#8fc0ec" },
    { name: "eBPF",       handle: "@linux-kernel", pill: "learning", color: "#a9d29a" },
    { name: "PostgreSQL", handle: "@docker",       pill: "using",    color: "#a8b8e0" },
  ],

  // "Current Obsessions" box
  obsessions: [
    { tag: "#eBPF",                 sub: "tracepoints · ring buffers" },
    { tag: "#SupplyChainSecurity",  sub: "watch what actually runs" },
    { tag: "#Linux",                sub: "syscalls · namespaces · cgroups" },
    { tag: "#Kotlin",               sub: "coroutines · compose" },
    { tag: "#TokyoNight",           sub: "the only editor theme" },
  ],

  // ":: about me" post
  about: {
    html: `<p>Hello! 컴퓨터소프트웨어공학을 전공하는 주니어 개발자 <span class="hl">DevLSJ</span>입니다. 편하게 <span class="hl">LSJ</span>라고 불러 주세요.</p>
<p>Kotlin으로 <span class="it">모바일 앱</span>을, Java와 TypeScript로 <span class="it">관리자 웹</span>을, Python으로 <span class="it">탐지 서비스</span>를 만들어 봤습니다. 지금은 <span class="hl">eBPF</span>로 리눅스 커널 레벨에서 공급망 공격을 잡아내는 캡스톤 프로젝트에 집중하고 있습니다.</p>
<p>애플리케이션 위에서만 보던 문제를 커널 아래에서 다시 보는 일에 재미를 붙였고, 새 시스템 기술은 읽는 것보다 <span class="it">직접 만들어 보면서</span> 배우는 편입니다. 쉬는 날엔 터미널 테마를 고르다 하루가 갑니다.</p>`,
    date: "2026-09-28T12:00:00+09:00",
  },

  // Per-repository card text. Anything missing falls back to the GitHub description / language.
  repoMeta: {
    "eBPF-Trace":       { title: "Kernel-level watcher",   type: "Systems security", stack: "Python · C · React · Terraform" },
    "AdminWeb":         { title: "Company admin console",  type: "Enterprise web",   stack: "Java · TypeScript · PostgreSQL" },
    "JansangTravel":    { title: "Mobile term project",    type: "Android app",      stack: "Kotlin" },
    "CLI_Crypto":       { title: "Crypto programming",     type: "CLI tool",         stack: "C" },
    "comment-guardian": { title: "BLEP competition",       type: "Competition entry" },
    "CSW_Commentary":   { title: "Reading notes",          type: "Writing",          stack: "Markdown" },
  },
  hiddenRepos: ["DevLSJ"],   // profile-README repo and anything else to keep off the feed
  hideForks: true,

  langColors: {
    Kotlin: "#b79cf0", Java: "#e8b088", Python: "#9fbde6", TypeScript: "#8fc0ec", JavaScript: "#f0d78a",
    C: "#b8b3c2", "C++": "#e2a0c0", Shell: "#a9d29a", HTML: "#f0a58a", CSS: "#a99ce8", Go: "#8fd0e6", Rust: "#e0b090",
  },

  footer: "DevLSJ profile layout · inspired by classic tumblr themes · built with plain html, css and the github api",
};

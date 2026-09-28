#!/usr/bin/env python3
"""Regenerate the pastel placeholder art (banner, avatar, about, favicon).

    python3 scripts/gen_placeholders.py

Edit PALETTE to retint everything. Real images dropped into assets/ take precedence.
"""
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "assets"

PALETTE = dict(
    grad=["#f6fbfe", "#dcefFA", "#bfe0f6", "#e9f0fb"],       # banner gradient stops
    bokeh=["#d6ecfa", "#bfe0f6", "#ffffff", "#dbe9fb"],      # soft circles
    petals=["#a9d4f0", "#8fc4ec", "#cfe6f8", "#9ec6ee", "#ffffff"],
    accent="#8fc4ec", accent_ink="#5aa6dc", deep="#4f6b82", mid="#6f92ad",
    fill="#dcefFA", stroke="#bfe0f6", av_grad=["#d4eafa", "#8fc0ea"], about_grad=["#f2f9fe", "#d6eaf9"],
    dots=["#f3a8c4", "#f6d68a", "#a9dcb0"],
)

def petal(cx, cy, rx, ry, rot, fill, op):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" transform="rotate({rot} {cx} {cy})" fill="{fill}" opacity="{op}"/>'

def banner():
    random.seed(7)
    P = PALETTE; W, H = 1200, 480
    g = P["grad"]
    b = [f'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{g[0]}"/><stop offset=".45" stop-color="{g[1]}"/><stop offset=".8" stop-color="{g[2]}"/><stop offset="1" stop-color="{g[3]}"/></linearGradient>',
         '<filter id="blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="28"/></filter>',
         '<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter></defs>',
         f'<rect width="{W}" height="{H}" fill="url(#g)"/>']
    for _ in range(9):
        b.append(f'<circle cx="{random.randint(80,1120)}" cy="{random.randint(40,440)}" r="{random.randint(60,150)}" fill="{random.choice(P["bokeh"])}" opacity=".55" filter="url(#blur)"/>')
    for _ in range(38):
        b.append(petal(random.randint(0, W), random.randint(0, H), random.randint(6, 16), random.randint(3, 7), random.randint(0, 180),
                       random.choice(P["petals"]), round(random.uniform(.35, .8), 2)))
    b.append('<path d="M-20 400 C 200 300, 380 460, 620 340 S 1000 240, 1240 380" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2" filter="url(#soft)"/>')
    b.append('<path d="M-20 440 C 260 360, 420 500, 700 400 S 1040 300, 1240 420" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.5"/>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">\n' + "\n".join(b) + "\n</svg>\n"

def avatar():
    P = PALETTE; a, b = P["av_grad"]; pt = P["petals"]
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient></defs>
<rect width="400" height="400" fill="url(#g)"/>
{petal(80,90,44,18,-30,pt[2],.7)}{petal(330,300,54,22,20,"#ffffff",.5)}{petal(300,80,36,14,50,"#ffffff",.6)}
<text x="200" y="236" text-anchor="middle" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="118" font-weight="700" fill="#fff">&gt;_</text>
</svg>
'''

def about():
    P = PALETTE; a, b = P["about_grad"]; pt = P["petals"]; d = P["dots"]
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420" width="420" height="420">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient></defs>
<rect width="420" height="420" rx="24" fill="url(#g)"/>
{petal(60,70,40,16,-25,pt[2],.8)}{petal(370,60,34,13,35,pt[1],.6)}{petal(390,380,46,18,-15,"#ffffff",.7)}{petal(40,360,30,12,40,pt[2],.6)}
<rect x="70" y="120" width="280" height="190" rx="16" fill="#fff" stroke="{P["stroke"]}" stroke-width="3"/>
<rect x="70" y="120" width="280" height="34" rx="16" fill="{P["fill"]}"/><rect x="70" y="140" width="280" height="14" fill="{P["fill"]}"/>
<circle cx="92" cy="137" r="6" fill="{d[0]}"/><circle cx="112" cy="137" r="6" fill="{d[1]}"/><circle cx="132" cy="137" r="6" fill="{d[2]}"/>
<g font-family="ui-monospace,Menlo,Consolas,monospace" font-size="15" fill="{P["mid"]}">
<text x="90" y="186"><tspan fill="{P["accent_ink"]}">$</tspan> whoami</text>
<text x="90" y="212" fill="{P["deep"]}">devlsj</text>
<text x="90" y="238"><tspan fill="{P["accent_ink"]}">$</tspan> cat now.txt</text>
<text x="90" y="264" fill="{P["deep"]}">eBPF · kernel · security</text>
<text x="90" y="290"><tspan fill="{P["accent_ink"]}">$</tspan> <tspan fill="{P["accent"]}">▌</tspan></text>
</g>
</svg>
'''

def favicon():
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="{PALETTE["accent"]}"/><text x="32" y="42" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="28" font-weight="700" fill="#fff">&gt;_</text></svg>\n'

if __name__ == "__main__":
    (ROOT / "banner-placeholder.svg").write_text(banner())
    (ROOT / "avatar-placeholder.svg").write_text(avatar())
    (ROOT / "about-placeholder.svg").write_text(about())
    (ROOT / "favicon.svg").write_text(favicon())
    print("placeholders regenerated in", ROOT)

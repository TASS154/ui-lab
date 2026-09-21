(() => {
  const THEMES = [
    {
      id: "molten-glass",
      name: "Molten Glass",
      desc: "Glassmorphism líquido",
      tags: "Glassmorphism · calor · blur",
      group: "pure",
      chip: "linear-gradient(135deg,#e89a3c,#7ed4c8)",
      eyebrow: "Molten glass atelier",
      title: "Vidro que ainda respira calor.",
      lede: "Camadas translúcidas, bordas quentes e luz que escorre — glassmorphism com temperamento de forno.",
    },
    {
      id: "neumorphism",
      name: "Neumorphism",
      desc: "Soft UI embutido",
      tags: "Neumorphism · soft · relief",
      group: "pure",
      chip: "linear-gradient(145deg,#e6e9ef,#c5c9d2)",
      eyebrow: "Soft interface",
      title: "Relevo suave, quase tátil.",
      lede: "Luz e sombra internas criam botões que parecem esculpidos no próprio fundo.",
    },
    {
      id: "minimalism",
      name: "Minimalism",
      desc: "Redução radical",
      tags: "Minimalism · whitespace · type",
      group: "pure",
      chip: "linear-gradient(135deg,#fff,#111)",
      eyebrow: "Less, still less",
      title: "Só o que precisa existir.",
      lede: "Sem sombra teatral, sem ornamento. Tipografia, espaço e contraste fazem o trabalho.",
    },
    {
      id: "dark-tech",
      name: "Dark Tech",
      desc: "Terminal & neon",
      tags: "Dark Tech · mono · grid",
      group: "pure",
      chip: "linear-gradient(135deg,#07090d,#3dff9a)",
      eyebrow: "systems/online",
      title: "Interfaces que brilham no escuro.",
      lede: "Grid sutil, accent ácido e tipografia mono — vibe de console e produto developer.",
    },
    {
      id: "frutiger-aero",
      name: "Frutiger Aero",
      desc: "Glossy Y2K utopia",
      tags: "Frutiger Aero · gloss · sky",
      group: "pure",
      chip: "linear-gradient(180deg,#a8d8f0,#6ee0a8)",
      eyebrow: "Welcome to 2007",
      title: "Céu de vidro e botões brilhantes.",
      lede: "Gradientes aqua, highlights especulares e aquela esperança digital do início dos anos 2000.",
    },
    {
      id: "neobrutalism",
      name: "Neobrutalism",
      desc: "Maximalismo gen-z",
      tags: "Neobrutalism · Maximalism · bold",
      group: "pure",
      chip: "linear-gradient(135deg,#fff45a,#ff3d00,#00e5ff)",
      eyebrow: "LOUD BY DESIGN",
      title: "Bordas grossas. Cores gritantes.",
      lede: "Sombras hard-offset, tipografia de cartaz e zero vergonha de ocupar o espaço.",
    },
    {
      id: "skeuomorphism",
      name: "Skeuomorphism",
      desc: "Materiais reais",
      tags: "Skeuomorphism · wood · metal",
      group: "pure",
      chip: "linear-gradient(180deg,#f5e6d3,#8b4513)",
      eyebrow: "Crafted surfaces",
      title: "Parece madeira. Parece metal.",
      lede: "Gradientes que imitam materiais físicos — o encanto pré-flat do software tátil.",
    },
    {
      id: "gradient-mesh",
      name: "Gradient Mesh",
      desc: "Mesh colorido",
      tags: "Gradient Mesh · aurora · fluid",
      group: "pure",
      chip: "linear-gradient(135deg,#ff6ad5,#6a9fff,#00d4c8)",
      eyebrow: "Color field UI",
      title: "Cor como arquitetura.",
      lede: "Manchas de mesh se misturam atrás de superfícies translúcidas — UI como pintura digital.",
    },
    {
      id: "enterprise",
      name: "Enterprise Clean",
      desc: "SaaS corporativo",
      tags: "Enterprise · B2B · clean",
      group: "pure",
      chip: "linear-gradient(135deg,#f4f6f9,#2563eb)",
      eyebrow: "Trusted by teams",
      title: "Clareza que escala com o time.",
      lede: "Azul confiável, cards leves e hierarquia previsível — o visual de produtos B2B maduros.",
    },
    {
      id: "molten-dark-luxury",
      name: "Molten Dark Luxury",
      desc: "Glass + Dark + Luxe",
      tags: "Molten Glass · Dark Tech · Luxury Minimal",
      group: "mix",
      chip: "linear-gradient(135deg,#0c0b0a,#d4a574)",
      eyebrow: "Quiet heat",
      title: "Luxo escuro com brasa de vidro.",
      lede: "Minimalismo luxuoso encontra molten glass e dark tech — ouro fosco sobre carvão.",
    },
    {
      id: "linear-bento",
      name: "Linear Bento",
      desc: "Linear + Bento + Mini",
      tags: "Linear-inspired · Bento UI · Minimalism",
      group: "mix",
      chip: "linear-gradient(135deg,#0f0f10,#5e6ad2)",
      eyebrow: "Product craft",
      title: "Densidade elegante em caixas.",
      lede: "A precisão do Linear, a grade bento e o silêncio do minimalismo — UI de ferramenta moderna.",
    },
    {
      id: "neo-organic-max",
      name: "Organic Brutal",
      desc: "Neo + Organic + Max",
      tags: "Neobrutalism · Organic UI · Maximalism",
      group: "mix",
      chip: "linear-gradient(135deg,#ff8fab,#b8f205,#7bdff2)",
      eyebrow: "WILD FORMS",
      title: "Brutalismo com curvas vivas.",
      lede: "Offsets duros, raios irregulares e cores de festa — maximalismo orgânico sem pedir licença.",
    },
    {
      id: "aero-glass",
      name: "Aero Glass",
      desc: "Aero + Glassmorphism",
      tags: "Frutiger Aero · Glassmorphism",
      group: "mix",
      chip: "linear-gradient(135deg,#7ec0e8,#48c9a0)",
      eyebrow: "Sky through glass",
      title: "Vidro fosco sob céu utópico.",
      lede: "O gloss do Frutiger Aero atravessa painéis glass — nostalgia 2000 com blur moderno.",
    },
    {
      id: "soft-enterprise",
      name: "Soft Enterprise",
      desc: "Neo + Enterprise",
      tags: "Neumorphism · Enterprise Clean",
      group: "mix",
      chip: "linear-gradient(145deg,#eef1f6,#3b82f6)",
      eyebrow: "Gentle productivity",
      title: "Corporativo, mas macio.",
      lede: "A confiança do enterprise com o relevo neumórfico — dashboards que pedem para tocar.",
    },
    {
      id: "skeuo-luxe",
      name: "Skeuo Luxe Mesh",
      desc: "Skeuo + Mesh + Luxe",
      tags: "Skeuomorphism · Gradient Mesh · Luxury",
      group: "mix",
      chip: "linear-gradient(135deg,#1a1220,#d4af78,#8b5a9e)",
      eyebrow: "Gilded aurora",
      title: "Metal precioso sob aurora.",
      lede: "Skeuomorphism dourado dança com mesh violeta — opulência digital com profundidade de material.",
    },
    {
      id: "brutal-tech",
      name: "Brutal Tech",
      desc: "Neo + Dark Tech",
      tags: "Neobrutalism · Dark Tech",
      group: "mix",
      chip: "linear-gradient(135deg,#0a0a0a,#e8ff47,#ff2d55)",
      eyebrow: "HACK THE FRAME",
      title: "Terminal com atitude de cartaz.",
      lede: "Mono ácido, offsets pink e grid brutal — dark tech que grita em vez de sussurrar.",
    },
  ];

  const FULL_OUT_MS = 520;
  const FULL_IN_MS = 620;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const html = document.documentElement;
  const morphRoot = document.getElementById("morph-root");
  const preview = document.getElementById("preview");
  const pureList = document.getElementById("pure-list");
  const mixList = document.getElementById("mix-list");
  const themeLabel = document.getElementById("theme-label");
  const themeTags = document.getElementById("theme-tags");
  const footerTheme = document.getElementById("footer-theme");
  const heroEyebrow = document.getElementById("hero-eyebrow");
  const heroTitle = document.getElementById("hero-title");
  const heroLede = document.getElementById("hero-lede");
  const picker = document.getElementById("picker");
  const backdrop = document.getElementById("picker-backdrop");

  const pieceSelectors = [
    ".ui-nav",
    ".ui-hero-copy",
    ".ui-hero-visual",
    ".ui-stats .stat",
    ".ui-section-head",
    ".ui-card",
    ".bento-cell",
    ".ui-panel",
    ".ui-footer",
  ];

  preview.querySelectorAll(pieceSelectors.join(",")).forEach((el, i) => {
    el.classList.add("morph-piece");
    el.style.setProperty("--i", String(i % 12));
  });

  let mount = 1;
  let raf = null;
  let runId = 0;
  let activeThemeId = null;
  let pendingThemeId = null;

  const easeInOut = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function paintMount(value) {
    mount = value;
    const dismount = 1 - value;
    morphRoot.style.setProperty("--mount", value.toFixed(4));
    morphRoot.style.setProperty("--dismount", dismount.toFixed(4));
    morphRoot.classList.toggle("is-morphing", value < 0.995 && value > 0.005);
  }

  function findTheme(id) {
    return THEMES.find((t) => t.id === id) || THEMES[0];
  }

  function updateChrome(theme) {
    themeLabel.textContent = theme.name;
    themeTags.textContent = theme.tags;
    document.querySelectorAll(".swatch").forEach((el) => {
      el.setAttribute("aria-selected", el.dataset.id === theme.id ? "true" : "false");
    });
  }

  function commitTheme(theme) {
    html.setAttribute("data-theme", theme.id);
    footerTheme.textContent = theme.name;
    heroEyebrow.textContent = theme.eyebrow;
    heroTitle.textContent = theme.title;
    heroLede.textContent = theme.lede;
    activeThemeId = theme.id;
  }

  function tweenMount(target, myRun) {
    return new Promise((resolve) => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }

      const from = mount;
      const delta = Math.abs(target - from);

      if (delta < 0.001) {
        paintMount(target);
        resolve();
        return;
      }

      const base = target < from ? FULL_OUT_MS : FULL_IN_MS;
      const duration = Math.max(90, base * delta);
      const t0 = performance.now();

      const tick = (now) => {
        if (myRun !== runId) {
          resolve();
          return;
        }

        const p = Math.min(1, (now - t0) / duration);
        paintMount(from + (target - from) * easeInOut(p));

        if (p < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          raf = null;
          paintMount(target);
          resolve();
        }
      };

      raf = requestAnimationFrame(tick);
    });
  }

  async function runCycle(myRun) {
    morphRoot.classList.add("is-morphing");

    await tweenMount(0, myRun);
    if (myRun !== runId) return;

    commitTheme(findTheme(pendingThemeId));

    await tweenMount(1, myRun);
    if (myRun !== runId) return;

    morphRoot.classList.remove("is-morphing");
  }

  function requestTheme(id, { persist = true, instant = false } = {}) {
    const theme = findTheme(id);
    pendingThemeId = theme.id;
    updateChrome(theme);

    if (persist) {
      try {
        localStorage.setItem("ui-lab-theme", theme.id);
      } catch (_) {}
    }

    closePicker();

    if (instant || reduceMotion) {
      runId += 1;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
      commitTheme(theme);
      paintMount(1);
      morphRoot.classList.remove("is-morphing");
      return;
    }

    if (theme.id === activeThemeId && mount > 0.995 && raf === null) {
      return;
    }

    const myRun = ++runId;
    runCycle(myRun);
  }

  const makeSwatch = (theme) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch";
    btn.role = "option";
    btn.dataset.id = theme.id;
    btn.setAttribute("aria-selected", "false");
    btn.innerHTML = `
      <span class="swatch-chip" style="background:${theme.chip}"></span>
      <span>
        <span class="swatch-name">${theme.name}</span>
        <span class="swatch-desc">${theme.desc}</span>
      </span>
    `;
    btn.addEventListener("click", () => requestTheme(theme.id));
    return btn;
  };

  THEMES.filter((t) => t.group === "pure").forEach((t) => pureList.appendChild(makeSwatch(t)));
  THEMES.filter((t) => t.group === "mix").forEach((t) => mixList.appendChild(makeSwatch(t)));

  function openPicker() {
    picker.classList.add("is-open");
    backdrop.hidden = false;
  }

  function closePicker() {
    picker.classList.remove("is-open");
    backdrop.hidden = true;
  }

  document.getElementById("picker-open").addEventListener("click", openPicker);
  document.getElementById("picker-close").addEventListener("click", closePicker);
  backdrop.addEventListener("click", closePicker);

  document.getElementById("random-theme").addEventListener("click", () => {
    const current = pendingThemeId || activeThemeId;
    let next = THEMES[Math.floor(Math.random() * THEMES.length)];
    let guard = 0;
    while (next.id === current && guard < 8) {
      next = THEMES[Math.floor(Math.random() * THEMES.length)];
      guard += 1;
    }
    requestTheme(next.id);
  });

  document.getElementById("demo-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = document.getElementById("form-ok");
    ok.hidden = false;
    e.target.reset();
  });

  let saved = "molten-glass";
  try {
    saved = localStorage.getItem("ui-lab-theme") || saved;
  } catch (_) {}

  paintMount(1);
  requestTheme(saved, { persist: false, instant: true });
})();

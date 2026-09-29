(() => {
  const THEMES = window.UI_LAB_THEMES || [];
  const FULL_OUT_MS = 520;
  const FULL_IN_MS = 620;
  const STORAGE_KEY = "ui-lab-theme";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const html = document.documentElement;
  const morphRoot = document.getElementById("morph-root");
  const preview = document.getElementById("preview");
  const pureList = document.getElementById("pure-list");
  const mixList = document.getElementById("mix-list");
  const pureCount = document.getElementById("pure-count");
  const mixCount = document.getElementById("mix-count");
  const pickerEmpty = document.getElementById("picker-empty");
  const themeFilter = document.getElementById("theme-filter");
  const themeLabel = document.getElementById("theme-label");
  const themeTags = document.getElementById("theme-tags");
  const themeLive = document.getElementById("theme-live");
  const footerTheme = document.getElementById("footer-theme");
  const heroEyebrow = document.getElementById("hero-eyebrow");
  const heroTitle = document.getElementById("hero-title");
  const heroLede = document.getElementById("hero-lede");
  const picker = document.getElementById("picker");
  const backdrop = document.getElementById("picker-backdrop");
  const pickerOpenBtn = document.getElementById("picker-open");
  const toast = document.getElementById("toast");

  const pures = THEMES.filter((t) => t.group === "pure");
  const mixes = THEMES.filter((t) => t.group === "mix");

  document.getElementById("stat-pures").textContent = String(pures.length);
  document.getElementById("stat-mixes").textContent = String(mixes.length);
  document.getElementById("stat-total").textContent = String(THEMES.length);
  pureCount.textContent = String(pures.length);
  mixCount.textContent = String(mixes.length);

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
  let toastTimer = null;

  const easeInOut = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function paintMount(value) {
    mount = value;
    const dismount = 1 - value;
    morphRoot.style.setProperty("--mount", value.toFixed(4));
    morphRoot.style.setProperty("--dismount", dismount.toFixed(4));
    const busy = value < 0.995 && value > 0.005;
    morphRoot.classList.toggle("is-morphing", busy);
  }

  function findTheme(id) {
    return THEMES.find((t) => t.id === id) || THEMES[0];
  }

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 2800);
  }

  function updateChrome(theme) {
    themeLabel.textContent = theme.name;
    themeTags.textContent = theme.tags;
    document.querySelectorAll(".swatch").forEach((el) => {
      const selected = el.dataset.id === theme.id;
      el.setAttribute("aria-selected", selected ? "true" : "false");
      el.classList.toggle("is-active", selected);
    });
  }

  function commitTheme(theme) {
    html.setAttribute("data-theme", theme.id);
    html.setAttribute("data-glass", theme.glass ? "1" : "0");
    html.setAttribute("data-feel", theme.feel || "rigid");
    footerTheme.textContent = theme.name;
    heroEyebrow.textContent = theme.eyebrow;
    heroTitle.textContent = theme.title;
    heroLede.textContent = theme.lede;
    activeThemeId = theme.id;
    themeLive.textContent = `Tema ativo: ${theme.name}. ${theme.tags}`;
    window.dispatchEvent(new CustomEvent("uilab:theme", { detail: theme }));
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
        localStorage.setItem(STORAGE_KEY, theme.id);
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

  function randomTheme() {
    const current = pendingThemeId || activeThemeId;
    let next = THEMES[Math.floor(Math.random() * THEMES.length)];
    let guard = 0;
    while (next.id === current && guard < 8) {
      next = THEMES[Math.floor(Math.random() * THEMES.length)];
      guard += 1;
    }
    requestTheme(next.id);
    showToast(`Surpresa: ${next.name}`);
  }

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function makeSwatch(theme) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch";
    btn.setAttribute("role", "option");
    btn.dataset.id = theme.id;
    btn.dataset.group = theme.group;
    btn.dataset.search = `${theme.name} ${theme.desc} ${theme.tags}`.toLowerCase();
    btn.setAttribute("aria-selected", "false");
    const isNew = [
      "glassmorphism",
      "memphis",
      "cyberpunk",
      "molten-clay",
      "cyber-glass",
      "memphis-brutal",
    ].includes(theme.id);
    btn.innerHTML = `
      <span class="swatch-chip" style="background:${theme.chip}" aria-hidden="true"></span>
      <span>
        <span class="swatch-name">${theme.name}${isNew ? ' <em class="swatch-new">novo</em>' : ""}</span>
        <span class="swatch-desc">${theme.desc}</span>
      </span>
    `;
    btn.addEventListener("click", () => requestTheme(theme.id));
    return btn;
  }

  pures.forEach((t) => pureList.appendChild(makeSwatch(t)));
  mixes.forEach((t) => mixList.appendChild(makeSwatch(t)));

  function applyFilter(query) {
    const q = query.trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll(".swatch").forEach((el) => {
      const show = !q || el.dataset.search.includes(q);
      el.hidden = !show;
      if (show) visible += 1;
    });
    document.querySelectorAll(".picker-group").forEach((group) => {
      const list = group.querySelector(".swatch-list");
      const any = list && [...list.children].some((c) => !c.hidden);
      group.hidden = !any;
    });
    pickerEmpty.hidden = visible > 0;
  }

  themeFilter.addEventListener("input", () => applyFilter(themeFilter.value));

  function openPicker(focusFilter = true) {
    picker.classList.add("is-open");
    backdrop.hidden = false;
    pickerOpenBtn.setAttribute("aria-expanded", "true");
    if (focusFilter) themeFilter.focus();
  }

  function closePicker() {
    picker.classList.remove("is-open");
    backdrop.hidden = true;
    pickerOpenBtn.setAttribute("aria-expanded", "false");
  }

  pickerOpenBtn.addEventListener("click", () => openPicker());
  document.getElementById("picker-close").addEventListener("click", closePicker);
  backdrop.addEventListener("click", closePicker);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && picker.classList.contains("is-open")) {
      closePicker();
      pickerOpenBtn.focus();
    }
  });

  document.getElementById("random-theme").addEventListener("click", randomTheme);
  document.getElementById("btn-styles").addEventListener("click", () => openPicker());
  document.getElementById("btn-start").addEventListener("click", () => {
    scrollToId("play");
    showToast("Playground tátil — arraste e clique nos objetos.");
  });
  document.getElementById("btn-docs").addEventListener("click", () => {
    scrollToId("features");
    showToast(`${pures.length} puros · ${mixes.length} mesclas · filtre no painel Estilos.`);
  });
  document.getElementById("stat-go-pures").addEventListener("click", () => {
    themeFilter.value = "";
    applyFilter("");
    openPicker();
    pureList.querySelector(".swatch")?.focus();
  });
  document.getElementById("stat-go-mixes").addEventListener("click", () => {
    themeFilter.value = "";
    applyFilter("");
    openPicker();
    mixList.querySelector(".swatch")?.focus();
  });
  document.getElementById("stat-go-random").addEventListener("click", randomTheme);

  document.querySelectorAll(".ui-card-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.action === "surprise") {
        randomTheme();
        return;
      }
      if (btn.dataset.jump) scrollToId(btn.dataset.jump);
    });
  });

  document.getElementById("demo-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = String(data.get("name") || "").trim();
    document.getElementById("form-ok").hidden = false;
    showToast(`Olá, ${name || "visitante"} — formulário ok no tema ${findTheme(activeThemeId).name}.`);
    e.target.reset();
  });

  window.UILab = { requestTheme, randomTheme, showToast, findTheme, get activeThemeId() { return activeThemeId; } };

  let saved = "molten-glass";
  try {
    saved = localStorage.getItem(STORAGE_KEY) || saved;
  } catch (_) {}

  paintMount(1);
  requestTheme(saved, { persist: false, instant: true });
})();

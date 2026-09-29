(() => {
  const arena = document.getElementById("play-arena");
  const hint = document.getElementById("play-hint");
  if (!arena) return;

  const FEELS = window.UI_LAB_FEELS || {};
  const objects = [...arena.querySelectorAll(".play-obj")];
  if (!objects.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const state = new Map();

  const HOMES = [
    { x: 0.14, y: 0.32 },
    { x: 0.44, y: 0.24 },
    { x: 0.66, y: 0.42 },
    { x: 0.30, y: 0.58 },
  ];

  function feel() {
    const key = document.documentElement.getAttribute("data-feel") || "rigid";
    return (
      FEELS[key] || {
        stiffness: 0.18,
        damping: 0.78,
        hover: 1.06,
        press: 0.94,
        jiggle: 10,
        elastic: false,
      }
    );
  }

  function measureHome(index) {
    const w = Math.max(arena.clientWidth, 280);
    const h = Math.max(arena.clientHeight, 240);
    const spot = HOMES[index % HOMES.length];
    const el = objects[index];
    const ow = el.offsetWidth || 88;
    const oh = el.offsetHeight || 88;
    return {
      x: Math.min(w - ow - 8, Math.max(8, spot.x * w)),
      y: Math.min(h - oh - 20, Math.max(28, spot.y * h)),
    };
  }

  function paint(el) {
    const s = state.get(el);
    if (!s) return;
    const f = feel();
    const squash = f.elastic ? s.squish : 1;
    el.style.left = `${s.x}px`;
    el.style.top = `${s.y}px`;
    el.style.transform = `rotate(${s.rot}deg) scale(${s.scale * squash}, ${s.scale / Math.max(0.5, squash)})`;
  }

  function clamp(el, s) {
    const maxX = Math.max(8, arena.clientWidth - el.offsetWidth - 8);
    const maxY = Math.max(28, arena.clientHeight - el.offsetHeight - 16);
    s.x = Math.min(maxX, Math.max(8, s.x));
    s.y = Math.min(maxY, Math.max(28, s.y));
  }

  function initPositions() {
    objects.forEach((el, index) => {
      const home = measureHome(index);
      let s = state.get(el);
      if (!s) {
        s = {
          x: home.x,
          y: home.y,
          vx: 0,
          vy: 0,
          scale: 1,
          rot: 0,
          vr: 0,
          home,
          dragging: false,
          pointerId: null,
          ox: 0,
          oy: 0,
          squish: 1,
        };
        state.set(el, s);
      } else {
        s.home = home;
        if (!s.dragging) {
          s.x = home.x;
          s.y = home.y;
          s.vx = 0;
          s.vy = 0;
        }
      }
      paint(el);
    });
  }

  objects.forEach((el) => {
    el.addEventListener("pointerdown", (e) => {
      const s = state.get(el);
      if (!s) return;
      el.setPointerCapture(e.pointerId);
      const rect = el.getBoundingClientRect();
      const arenaRect = arena.getBoundingClientRect();
      s.dragging = true;
      s.pointerId = e.pointerId;
      s.ox = e.clientX - rect.left;
      s.oy = e.clientY - rect.top;
      s.vx = 0;
      s.vy = 0;
      el.classList.add("is-dragging");
      s.scale = feel().press;
      s.squish = feel().elastic ? 0.86 : 1;
      paint(el);
      if (hint) {
        hint.textContent = `${el.dataset.label} · feel: ${document.documentElement.getAttribute("data-feel")}`;
      }
      e.preventDefault();
    });

    el.addEventListener("pointermove", (e) => {
      const s = state.get(el);
      if (!s || !s.dragging || s.pointerId !== e.pointerId) return;
      const arenaRect = arena.getBoundingClientRect();
      const nx = e.clientX - arenaRect.left - s.ox;
      const ny = e.clientY - arenaRect.top - s.oy;
      s.vx = nx - s.x;
      s.vy = ny - s.y;
      s.x = nx;
      s.y = ny;
      s.rot += s.vx * 0.12;
      clamp(el, s);
      paint(el);
    });

    const endDrag = (e) => {
      const s = state.get(el);
      if (!s || !s.dragging) return;
      if (e && s.pointerId != null && e.pointerId !== s.pointerId) return;
      s.dragging = false;
      s.pointerId = null;
      el.classList.remove("is-dragging");
      const f = feel();
      s.scale = 1;
      s.squish = 1;
      s.vx *= f.elastic ? 0.9 : 0.25;
      s.vy *= f.elastic ? 0.9 : 0.25;
      paint(el);
      if (hint) hint.textContent = "Arraste os objetos · clique para pulsar";
    };

    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);

    el.addEventListener("pointerenter", () => {
      const s = state.get(el);
      if (!s || s.dragging) return;
      el.classList.add("is-hover");
      s.scale = feel().hover;
      paint(el);
    });

    el.addEventListener("pointerleave", () => {
      const s = state.get(el);
      el.classList.remove("is-hover");
      if (s && !s.dragging) {
        s.scale = 1;
        paint(el);
      }
    });

    el.addEventListener("click", () => {
      const s = state.get(el);
      if (!s || Math.hypot(s.vx, s.vy) > 6) return;
      pulse(el);
    });

    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pulse(el);
      }
    });
  });

  function pulse(el) {
    const s = state.get(el);
    if (!s) return;
    const f = feel();
    s.scale = f.hover * 1.1;
    s.squish = f.elastic ? 0.8 : 1;
    s.vr += (Math.random() - 0.5) * f.jiggle * 0.5;
    s.vx += (Math.random() - 0.5) * f.jiggle * 0.35;
    s.vy += (Math.random() - 0.5) * f.jiggle * 0.35;
    paint(el);
    setTimeout(() => {
      if (!s.dragging) {
        s.scale = 1;
        s.squish = 1;
      }
    }, 180);
  }

  function resetPositions() {
    initPositions();
    window.UILab?.showToast("Posições resetadas.");
  }

  function jiggleAll() {
    const f = feel();
    objects.forEach((el) => {
      const s = state.get(el);
      if (!s) return;
      s.vx += (Math.random() - 0.5) * f.jiggle;
      s.vy += (Math.random() - 0.5) * f.jiggle;
      s.vr += (Math.random() - 0.5) * f.jiggle * 0.45;
      if (f.elastic) s.squish = 0.82 + Math.random() * 0.25;
    });
    window.UILab?.showToast(`Sacudida · ${document.documentElement.getAttribute("data-feel")}`);
  }

  document.getElementById("btn-reset-play")?.addEventListener("click", resetPositions);
  document.getElementById("btn-jiggle")?.addEventListener("click", jiggleAll);

  window.addEventListener("uilab:theme", () => {
    objects.forEach((el) => {
      const s = state.get(el);
      if (s && !s.dragging) {
        s.scale = 1;
        s.squish = 1;
        paint(el);
      }
    });
    if (hint) {
      hint.textContent = `Física: ${document.documentElement.getAttribute("data-feel")} · arraste e clique`;
    }
  });

  window.addEventListener("resize", () => {
    objects.forEach((el, index) => {
      const s = state.get(el);
      if (!s) return;
      s.home = measureHome(index);
      clamp(el, s);
      paint(el);
    });
  });

  function tick() {
    const f = feel();
    objects.forEach((el) => {
      const s = state.get(el);
      if (!s || s.dragging) return;

      if (f.elastic && !reduceMotion) {
        s.vx = (s.vx + (s.home.x - s.x) * f.stiffness) * f.damping;
        s.vy = (s.vy + (s.home.y - s.y) * f.stiffness) * f.damping;
        s.x += s.vx;
        s.y += s.vy;
        s.vr = (s.vr - s.rot * 0.05) * f.damping;
        s.rot += s.vr;
        s.squish += (1 - s.squish) * 0.14;
      } else {
        s.vx *= 0.8;
        s.vy *= 0.8;
        s.x += s.vx;
        s.y += s.vy;
        s.rot *= 0.88;
        s.squish += (1 - s.squish) * 0.25;
      }

      clamp(el, s);
      paint(el);
    });
    requestAnimationFrame(tick);
  }

  // espera layout (evita width 0)
  requestAnimationFrame(() => {
    initPositions();
    requestAnimationFrame(tick);
  });
})();

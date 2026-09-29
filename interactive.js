(() => {
  const arena = document.getElementById("play-arena");
  const hint = document.getElementById("play-hint");
  if (!arena) return;

  const FEELS = window.UI_LAB_FEELS || {};
  const objects = [...arena.querySelectorAll(".play-obj")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = new Map();

  function currentFeel() {
    const key = document.documentElement.getAttribute("data-feel") || "rigid";
    return FEELS[key] || FEELS.rigid || {
      stiffness: 0.2,
      damping: 0.75,
      hover: 1.04,
      press: 0.96,
      jiggle: 8,
      elastic: false,
    };
  }

  function homeFor(el, index) {
    const homes = [
      { x: 0.12, y: 0.28 },
      { x: 0.42, y: 0.22 },
      { x: 0.68, y: 0.38 },
      { x: 0.28, y: 0.55 },
    ];
    const h = homes[index % homes.length];
    return {
      x: h.x * arena.clientWidth,
      y: h.y * arena.clientHeight,
    };
  }

  objects.forEach((el, index) => {
    const home = homeFor(el, index);
    state.set(el, {
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
    });
    el.style.left = "0px";
    el.style.top = "0px";
  });

  function paint(el) {
    const s = state.get(el);
    const feel = currentFeel();
    const squash = feel.elastic ? s.squish : 1;
    el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg) scale(${s.scale * squash}, ${s.scale / squash})`;
  }

  function clamp(el, s) {
    const maxX = Math.max(0, arena.clientWidth - el.offsetWidth);
    const maxY = Math.max(0, arena.clientHeight - el.offsetHeight - 12);
    s.x = Math.min(maxX, Math.max(0, s.x));
    s.y = Math.min(maxY, Math.max(0, s.y));
  }

  let dragging = null;

  objects.forEach((el) => {
    paint(el);

    el.addEventListener("pointerdown", (e) => {
      const s = state.get(el);
      el.setPointerCapture(e.pointerId);
      s.dragging = true;
      s.pointerId = e.pointerId;
      s.ox = e.clientX - s.x;
      s.oy = e.clientY - s.y;
      s.vx = 0;
      s.vy = 0;
      dragging = el;
      el.classList.add("is-dragging");
      const feel = currentFeel();
      s.scale = feel.press;
      s.squish = feel.elastic ? 0.88 : 1;
      paint(el);
      if (hint) hint.textContent = `Segurando ${el.dataset.label} · solte para física ${document.documentElement.getAttribute("data-feel")}`;
    });

    el.addEventListener("pointermove", (e) => {
      const s = state.get(el);
      if (!s.dragging || s.pointerId !== e.pointerId) return;
      const nx = e.clientX - s.ox;
      const ny = e.clientY - s.oy;
      s.vx = nx - s.x;
      s.vy = ny - s.y;
      s.x = nx;
      s.y = ny;
      s.rot += s.vx * 0.15;
      clamp(el, s);
      paint(el);
    });

    const endDrag = (e) => {
      const s = state.get(el);
      if (!s.dragging || (e && s.pointerId !== e.pointerId)) return;
      s.dragging = false;
      s.pointerId = null;
      el.classList.remove("is-dragging");
      dragging = null;
      const feel = currentFeel();
      s.scale = 1;
      s.squish = 1;
      if (!feel.elastic) {
        s.vx *= 0.2;
        s.vy *= 0.2;
      } else {
        s.vx *= 0.85;
        s.vy *= 0.85;
      }
      paint(el);
      if (hint) hint.textContent = "Arraste os objetos · clique para pulsar";
    };

    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);

    el.addEventListener("pointerenter", () => {
      if (state.get(el).dragging) return;
      el.classList.add("is-hover");
      const s = state.get(el);
      s.scale = currentFeel().hover;
      paint(el);
    });

    el.addEventListener("pointerleave", () => {
      el.classList.remove("is-hover");
      const s = state.get(el);
      if (!s.dragging) {
        s.scale = 1;
        paint(el);
      }
    });

    el.addEventListener("click", (e) => {
      if (Math.abs(state.get(el).vx) > 4 || Math.abs(state.get(el).vy) > 4) return;
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
    const feel = currentFeel();
    s.scale = feel.hover * 1.08;
    s.squish = feel.elastic ? 0.82 : 1;
    s.vr = (Math.random() - 0.5) * feel.jiggle * 0.4;
    s.vx += (Math.random() - 0.5) * feel.jiggle * 0.3;
    s.vy += (Math.random() - 0.5) * feel.jiggle * 0.3;
    paint(el);
    setTimeout(() => {
      if (!s.dragging) {
        s.scale = 1;
        s.squish = 1;
      }
    }, 160);
  }

  function resetPositions() {
    objects.forEach((el, index) => {
      const s = state.get(el);
      s.home = homeFor(el, index);
      s.x = s.home.x;
      s.y = s.home.y;
      s.vx = 0;
      s.vy = 0;
      s.rot = 0;
      s.vr = 0;
      s.scale = 1;
      s.squish = 1;
      paint(el);
    });
    if (window.UILab) window.UILab.showToast("Posições resetadas.");
  }

  function jiggleAll() {
    const feel = currentFeel();
    objects.forEach((el) => {
      const s = state.get(el);
      s.vx += (Math.random() - 0.5) * feel.jiggle;
      s.vy += (Math.random() - 0.5) * feel.jiggle;
      s.vr += (Math.random() - 0.5) * feel.jiggle * 0.5;
      if (feel.elastic) s.squish = 0.85 + Math.random() * 0.2;
    });
    if (window.UILab) window.UILab.showToast(`Sacudida ${document.documentElement.getAttribute("data-feel")}.`);
  }

  document.getElementById("btn-reset-play")?.addEventListener("click", resetPositions);
  document.getElementById("btn-jiggle")?.addEventListener("click", jiggleAll);

  window.addEventListener("uilab:theme", () => {
    objects.forEach((el) => {
      const s = state.get(el);
      if (!s.dragging) {
        s.scale = 1;
        s.squish = 1;
        paint(el);
      }
    });
    if (hint) {
      const feel = document.documentElement.getAttribute("data-feel");
      hint.textContent = `Física: ${feel} · arraste e clique`;
    }
  });

  window.addEventListener("resize", () => {
    objects.forEach((el, index) => {
      const s = state.get(el);
      s.home = homeFor(el, index);
      clamp(el, s);
      paint(el);
    });
  });

  function tick() {
    const feel = currentFeel();
    objects.forEach((el) => {
      const s = state.get(el);
      if (s.dragging) return;

      if (feel.elastic && !reduceMotion) {
        const ax = (s.home.x - s.x) * feel.stiffness;
        const ay = (s.home.y - s.y) * feel.stiffness;
        s.vx = (s.vx + ax) * feel.damping;
        s.vy = (s.vy + ay) * feel.damping;
        s.x += s.vx;
        s.y += s.vy;
        s.vr = (s.vr - s.rot * 0.04) * feel.damping;
        s.rot += s.vr;
        s.squish += (1 - s.squish) * 0.12;
      } else {
        s.vx *= 0.82;
        s.vy *= 0.82;
        s.x += s.vx;
        s.y += s.vy;
        s.rot *= 0.9;
        s.squish += (1 - s.squish) * 0.2;
      }

      clamp(el, s);
      paint(el);
    });
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();

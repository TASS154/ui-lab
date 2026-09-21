(() => {
  const light = document.createElement("div");
  light.className = "pointer-light";
  document.body.appendChild(light);

  let raf = null;
  let targetX = 0;
  let targetY = 0;
  let x = 0;
  let y = 0;

  const tick = () => {
    x += (targetX - x) * 0.12;
    y += (targetY - y) * 0.12;
    light.style.left = `${x}px`;
    light.style.top = `${y}px`;
    raf = requestAnimationFrame(tick);
  };

  const onMove = (e) => {
    document.body.classList.add("has-pointer");
    targetX = e.clientX;
    targetY = e.clientY;
    if (!raf) raf = requestAnimationFrame(tick);
  };

  window.addEventListener("pointermove", onMove, { passive: true });

  window.addEventListener(
    "pointerleave",
    () => {
      document.body.classList.remove("has-pointer");
    },
    { passive: true }
  );

  const form = document.querySelector(".glass-form");
  const note = document.getElementById("form-note");

  if (form && note) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      note.hidden = false;
      form.reset();
    });
  }

  const panes = document.querySelectorAll(".pane, .temp-glass, .liquid-orb");
  window.addEventListener(
    "pointermove",
    (e) => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      panes.forEach((el, i) => {
        const depth = (i % 3) + 1;
        el.style.translate = `${cx * 6 * depth}px ${cy * 4 * depth}px`;
      });
    },
    { passive: true }
  );
})();

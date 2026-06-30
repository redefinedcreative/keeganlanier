const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── Scroll reveals: native IntersectionObserver + CSS (no animation library) ──
function setupReveals() {
  const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
  if (prefersReduced) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
  );
  items.forEach((el) => io.observe(el));
}

setupReveals();

// ── Decorative motion (GSAP) — desktop only, dynamically imported ─────────────
// Mobile never downloads or parses GSAP, keeping main-thread/TBT low.
const wantsHeavyMotion =
  !prefersReduced && window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;

if (wantsHeavyMotion) {
  Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("gsap/MotionPathPlugin"),
  ]).then(([{ gsap }, { ScrollTrigger }, { MotionPathPlugin }]) => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    // The coaster car rides the lift hill → drop, on a gentle loop.
    const car = document.querySelector<SVGCircleElement>("#coaster-car");
    const path = document.querySelector<SVGPathElement>("#coaster-path");
    if (car && path) {
      gsap.to(car, {
        duration: 4.5,
        repeat: -1,
        repeatDelay: 2,
        ease: "power1.inOut",
        motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
      });
    }

    // Parallax drift on the ember glows for depth.
    gsap.utils.toArray<HTMLElement>(".ember-glow").forEach((glow) => {
      gsap.to(glow, {
        yPercent: 16,
        ease: "none",
        scrollTrigger: { trigger: glow, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  });
}

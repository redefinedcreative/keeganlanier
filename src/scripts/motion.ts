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

// ── Blueprint scenes (GSAP) — desktop only, dynamically imported ─────────────
// Mobile never downloads or parses GSAP, keeping main-thread/TBT low.
// Every scene is an enhancement over a complete static default: without JS
// (or with reduced motion) each drawing renders fully drawn.
const wantsHeavyMotion =
  !prefersReduced && window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;

if (wantsHeavyMotion) {
  Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("gsap/MotionPathPlugin"),
    import("gsap/DrawSVGPlugin"),
  ]).then(([{ gsap }, { ScrollTrigger }, { MotionPathPlugin }, { DrawSVGPlugin }]) => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, DrawSVGPlugin);

    const coaster = "cubic-bezier(0.16, 1, 0.3, 1)"; // matches --ease-coaster

    // ── Hero: the drawing draws itself, then the car rides it ──────────────
    const heroSvg = document.querySelector<SVGSVGElement>("#hero-schematic");
    const heroPath = document.querySelector<SVGPathElement>("#coaster-path");
    const heroCar = document.querySelector<SVGCircleElement>("#coaster-car");
    if (heroSvg && heroPath && heroCar && heroSvg.getBoundingClientRect().width > 0) {
      const draw = gsap.timeline({ defaults: { ease: "power2.out" } });
      draw
        .from(heroPath, { drawSVG: "0%", duration: 1.4 })
        .from("#hero-supports line", { drawSVG: "0%", duration: 0.35, stagger: 0.07 }, "-=0.7")
        .from("#hero-dim line", { drawSVG: "0%", duration: 0.4, stagger: 0.1 }, "-=0.3")
        .from(["#hero-dim text", "#hero-datum"], { opacity: 0, duration: 0.5 }, "-=0.2");

      // Dispatch → steady chain lift → hang at the crest → drop. Like the real thing.
      const ride = gsap.timeline({ repeat: -1, repeatDelay: 3.2, delay: 1.2 });
      const mp = { path: heroPath, align: heroPath, alignOrigin: [0.5, 0.5] as [number, number] };
      ride
        .to(heroCar, { motionPath: { ...mp, start: 0, end: 0.37 }, duration: 1.6, ease: "power1.inOut" })
        .to(heroCar, { motionPath: { ...mp, start: 0.37, end: 0.66 }, duration: 2.8, ease: "none" })
        .to(heroCar, { motionPath: { ...mp, start: 0.66, end: 0.72 }, duration: 1.4, ease: "power1.inOut" })
        .to(heroCar, { motionPath: { ...mp, start: 0.72, end: 1 }, duration: 1.1, ease: "power2.in" })
        .to(heroCar, { opacity: 0, duration: 0.3 }, "-=0.2")
        .set(heroCar, { opacity: 1, motionPath: { ...mp, start: 0, end: 0.001 } });

      // Gentle parallax exit for the whole schematic
      gsap.to(heroSvg, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true },
      });
    }

    // ── Section dividers: the hairline draws in as you cross it ────────────
    gsap.utils.toArray<SVGPathElement>(".divider-path").forEach((p) => {
      gsap.from(p, {
        drawSVG: "0%",
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: p, start: "top 85%", once: true },
      });
    });

    // ── Work: inspection stamps press onto the spec sheets ─────────────────
    gsap.utils.toArray<HTMLElement>(".spec-sheet .stamp").forEach((stamp) => {
      gsap.from(stamp, {
        opacity: 0,
        scale: 1.3,
        rotation: 1,
        duration: 0.65,
        ease: "back.out(1.4)",
        scrollTrigger: { trigger: stamp, start: "top 70%", once: true },
        onComplete: () => gsap.set(stamp, { clearProps: "transform" }), // hand rotation back to CSS
      });
    });

    // ── Experience: the career track draws under your scroll, car on the tip ─
    const track = document.querySelector<SVGPathElement>("#career-track");
    const trackCar = document.querySelector<SVGCircleElement>("#career-car");
    if (track && track.getBoundingClientRect().width > 0) {
      const scrub = {
        trigger: "#experience",
        start: "top 65%",
        end: "center 30%",
        scrub: 0.6,
      };
      gsap.fromTo(track, { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", scrollTrigger: scrub });
      gsap.from("#career-profile line", {
        drawSVG: "0%",
        ease: "none",
        stagger: 0.08,
        scrollTrigger: scrub,
      });
      gsap.from(".career-station", {
        opacity: 0,
        scale: 0.5,
        transformOrigin: "center",
        ease: "none",
        stagger: 0.18,
        scrollTrigger: scrub,
      });
      if (trackCar) {
        gsap.set(trackCar, { opacity: 1 });
        gsap.to(trackCar, {
          motionPath: { path: track, align: track, alignOrigin: [0.5, 0.5] },
          ease: "none",
          scrollTrigger: {
            ...scrub,
            onLeave: () => gsap.to(trackCar, { opacity: 0, duration: 0.4 }),
            onEnterBack: () => gsap.to(trackCar, { opacity: 1, duration: 0.2 }),
          },
        });
      }
    }

    // ── Notes: one highlight sweep across the after-hours note ─────────────
    const sweep = document.querySelector<HTMLElement>(".spotlight-sweep");
    if (sweep) {
      gsap
        .timeline({ scrollTrigger: { trigger: "#afterhours", start: "top 78%", once: true } })
        .set(sweep, { opacity: 1 })
        .fromTo(sweep, { xPercent: -40 }, { xPercent: 420, duration: 1.4, ease: "power2.inOut" })
        .to(sweep, { opacity: 0, duration: 0.3 }, "-=0.3");
    }

    // ── Footer: the car coasts in and settles at the stop block ────────────
    const brakePath = document.querySelector<SVGPathElement>("#footer-brake-path");
    const footerCar = document.querySelector<SVGCircleElement>("#footer-car");
    if (brakePath) {
      gsap.from(brakePath, {
        drawSVG: "0%",
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: "#footer-brake", start: "top 88%", once: true },
      });
    }
    if (footerCar && brakePath) {
      // Ride the final hill, then decelerate down the brake run to the block.
      const fmp = { path: brakePath, align: brakePath, alignOrigin: [0.5, 0.5] as [number, number] };
      gsap
        .timeline({ scrollTrigger: { trigger: "#footer-brake", start: "top 85%", once: true } })
        .to(footerCar, { motionPath: { ...fmp, start: 0, end: 0.42 }, duration: 1.0, ease: "power1.out" })
        .to(footerCar, { motionPath: { ...fmp, start: 0.42, end: 0.62 }, duration: 0.45, ease: "power1.in" })
        .to(footerCar, { motionPath: { ...fmp, start: 0.62, end: 0.965 }, duration: 1.4, ease: "power3.out" });
    }
    const endline = document.querySelector<HTMLElement>("#footer-endline");
    if (endline) {
      gsap.from(endline, {
        opacity: 0,
        letterSpacing: "0.08em",
        duration: 1.1,
        ease: coaster,
        scrollTrigger: { trigger: endline, start: "top 92%", once: true },
      });
    }

    // ── Parallax drift on the ember glows for depth ─────────────────────────
    gsap.utils.toArray<HTMLElement>(".ember-glow").forEach((glow) => {
      gsap.to(glow, {
        yPercent: 16,
        ease: "none",
        scrollTrigger: { trigger: glow, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  });
}

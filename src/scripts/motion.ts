import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function revealAllInstantly() {
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
}

if (prefersReduced) {
  // Honour reduced-motion: show everything, run no animation.
  revealAllInstantly();
} else {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  // Hero — staggered "lift hill" reveal on load.
  const heroItems = gsap.utils.toArray<HTMLElement>("#top [data-reveal]");
  gsap.to(heroItems, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.09,
    delay: 0.15,
  });

  // Every other section — reveal as it enters the viewport.
  gsap.utils.toArray<HTMLElement>("section:not(#top)").forEach((section) => {
    const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", section);
    if (!items.length) return;
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: { trigger: section, start: "top 78%" },
    });
  });

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
      scrollTrigger: {
        trigger: glow,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}

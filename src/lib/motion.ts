// Movimiento: scroll suave (Lenis) + animaciones GSAP.
// Con prefers-reduced-motion o sin JS, todo el contenido queda visible.
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import Lenis from "lenis"

gsap.registerPlugin(ScrollTrigger, SplitText)

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

function smoothScroll() {
  const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
  lenis.on("scroll", ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  document.addEventListener("click", (ev) => {
    const a = (ev.target as Element).closest?.("a[href^='#']") as HTMLAnchorElement | null
    if (!a) return
    const target = a.hash && document.querySelector(a.hash)
    if (!target) return
    ev.preventDefault()
    lenis.scrollTo(target as HTMLElement, { offset: -72 })
    history.pushState(null, "", a.hash)
  })
}

function hero() {
  gsap.fromTo("[data-hero-item]", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.09, ease: "power3.out" })
}

function reveals() {
  gsap.set(".reveal", { autoAlpha: 0, y: 30 })
  ScrollTrigger.batch(".reveal", {
    start: "top 88%",
    once: true,
    onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }),
  })
}

function splitHeadings() {
  document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    SplitText.create(el, {
      type: "words",
      mask: "words",
      wordsClass: "split-word",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.words, {
          yPercent: 110,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }),
    })
  })
}

function counters() {
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const end = Number(el.dataset.count)
    const obj = { v: 0 }
    gsap.to(obj, {
      v: end,
      duration: 1.8,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => (el.textContent = Math.round(obj.v).toString()),
    })
  })
}

function timeline() {
  const bar = document.querySelector("[data-timeline-bar]")
  if (!bar) return
  gsap.fromTo(
    bar,
    { scaleY: 0 },
    {
      scaleY: 1,
      transformOrigin: "top",
      ease: "none",
      scrollTrigger: { trigger: "[data-timeline]", start: "top 70%", end: "bottom 60%", scrub: true },
    },
  )
}

function marquee() {
  const track = document.querySelector("[data-marquee]")
  if (!track) return
  gsap.to(track, { xPercent: -50, duration: 45, ease: "none", repeat: -1 })
}

export function initMotion() {
  if (reduced()) return
  smoothScroll()
  hero()
  reveals()
  splitHeadings()
  counters()
  timeline()
  marquee()
}

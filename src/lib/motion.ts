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
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
  tl.fromTo("[data-hero-item]", { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1 })

  // La línea del gráfico se "dibuja" y el área aparece debajo
  const path = document.querySelector<SVGPathElement>("[data-chart-line]")
  if (path) {
    const len = path.getTotalLength()
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
    tl.to(path, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" }, 0.2)
    tl.fromTo("[data-chart-area]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, 1.4)
    tl.fromTo("[data-chart-dot]", { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.5, ease: "back.out(3)" }, 2.2)
  }
  gsap.to("[data-chart]", {
    yPercent: 14,
    ease: "none",
    scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom top", scrub: true },
  })
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
  gsap.to(track, { xPercent: -50, duration: 40, ease: "none", repeat: -1 })
}

function header() {
  const h = document.querySelector("[data-header]")
  if (!h) return
  ScrollTrigger.create({
    start: 40,
    onUpdate: (s) => h.classList.toggle("is-scrolled", s.scroll() > 40),
  })
}

export function initMotion() {
  header()
  if (reduced()) return
  smoothScroll()
  hero()
  reveals()
  splitHeadings()
  counters()
  timeline()
  marquee()
}

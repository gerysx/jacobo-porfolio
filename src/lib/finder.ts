// Utilidades del buscador y la calculadora (lado cliente). Consultan la API del Worker (/api/*).

export type Hit = { symbol: string; name: string; exchange: string; type: string }

export const nf = (n: number, d = 2) => n.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d })
export const sign = (n: number) => `${n >= 0 ? "+" : "−"}${nf(Math.abs(n))} %`
export const curSym = (c?: string) => (c === "EUR" ? "€" : c === "USD" ? "$" : c === "GBP" ? "£" : c ?? "")
export const money = (n: number, c?: string, d = 2) => `${nf(n, d)} ${curSym(c)}`

export async function api<T>(path: string): Promise<T> {
  const res = await fetch(path)
  const data = await res.json().catch(() => ({ error: "Respuesta no válida" }))
  if (!res.ok || data.error) throw new Error(data.error || `Error ${res.status}`)
  return data as T
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
const TYPE: Record<string, string> = { EQUITY: "Acción", ETF: "ETF", INDEX: "Índice", MUTUALFUND: "Fondo" }

/** Autocompletado sobre un input. La lista se pinta en `list` (un <ul> posicionado bajo el input). */
export function autocomplete(input: HTMLInputElement, list: HTMLElement, onPick: (h: Hit) => void) {
  let timer = 0
  let hits: Hit[] = []
  let active = -1
  let seq = 0

  const close = () => {
    list.hidden = true
    input.setAttribute("aria-expanded", "false")
    active = -1
  }
  const render = (msg?: string) => {
    list.hidden = false
    input.setAttribute("aria-expanded", "true")
    list.innerHTML = msg
      ? `<li class="px-3 py-2.5 text-sm text-muted">${esc(msg)}</li>`
      : hits
          .map(
            (h, i) => `<li role="option" data-i="${i}" aria-selected="${i === active}" class="flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-sm aria-selected:bg-paper hover:bg-paper">
              <span class="min-w-0"><span class="block truncate font-medium text-ink">${esc(h.name)}</span><span class="text-xs text-muted">${esc(h.symbol)} · ${esc(h.exchange)}</span></span>
              <span class="shrink-0 rounded border border-line px-1.5 py-0.5 text-[10px] font-medium text-muted">${TYPE[h.type] ?? h.type}</span>
            </li>`,
          )
          .join("")
  }
  const pick = (h: Hit) => {
    input.value = h.name
    close()
    onPick(h)
  }

  input.setAttribute("autocomplete", "off")
  input.setAttribute("role", "combobox")
  input.setAttribute("aria-expanded", "false")
  input.addEventListener("input", () => {
    clearTimeout(timer)
    const q = input.value.trim()
    if (q.length < 2) return close()
    timer = window.setTimeout(async () => {
      const n = ++seq
      render("Buscando…")
      try {
        const { results } = await api<{ results: Hit[] }>(`/api/search?q=${encodeURIComponent(q)}`)
        if (n !== seq) return
        hits = results
        active = -1
        hits.length ? render() : render("Sin resultados")
      } catch {
        if (n === seq) render("No se ha podido buscar ahora mismo")
      }
    }, 250)
  })
  input.addEventListener("keydown", (e) => {
    if (list.hidden || !hits.length) return
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      active = (active + (e.key === "ArrowDown" ? 1 : -1) + hits.length) % hits.length
      render()
    } else if (e.key === "Enter") {
      e.preventDefault()
      pick(hits[Math.max(active, 0)])
    } else if (e.key === "Escape") close()
  })
  list.addEventListener("mousedown", (e) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>("[data-i]")
    if (li) {
      e.preventDefault()
      pick(hits[Number(li.dataset.i)])
    }
  })
  input.addEventListener("blur", () => setTimeout(close, 120))
}

/** Dibuja una serie [fecha, valor] como línea + área en un <svg viewBox="0 0 1000 300">. */
export function drawChart(svg: SVGSVGElement, series: [string, number][], up: boolean) {
  const W = 1000
  const H = 300
  const vals = series.map((p) => p[1])
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const pad = (max - min) * 0.08 || 1
  const y = (v: number) => H - ((v - (min - pad)) / (max - min + 2 * pad)) * H
  const line = series.map((p, i) => `${i ? "L" : "M"}${((i / (series.length - 1)) * W).toFixed(1)} ${y(p[1]).toFixed(1)}`).join(" ")
  const color = up ? "rgb(var(--up))" : "rgb(var(--down))"
  svg.querySelector("[data-line]")!.setAttribute("d", line)
  svg.querySelector("[data-line]")!.setAttribute("stroke", color)
  svg.querySelector("[data-area]")!.setAttribute("d", `${line} L${W} ${H} L0 ${H} Z`)
  svg.querySelectorAll("stop").forEach((s) => s.setAttribute("stop-color", color))
}

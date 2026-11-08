// Descarga el histórico de los principales índices y lo guarda en src/data/indices.json.
// Fuente principal: Yahoo Finance (API pública de gráficos). Respaldo: Stooq (CSV).
// Si todo falla, se conserva el JSON anterior para que el build nunca se rompa.
import { readFile, writeFile } from "node:fs/promises"

const OUT = new URL("../src/data/indices.json", import.meta.url)

export const INDICES = [
  { id: "sp500", name: "S&P 500", region: "EE. UU.", yahoo: "^GSPC", stooq: "^spx" },
  { id: "nasdaq100", name: "Nasdaq 100", region: "EE. UU.", yahoo: "^NDX", stooq: "^ndx" },
  { id: "eurostoxx50", name: "Euro Stoxx 50", region: "Zona euro", yahoo: "^STOXX50E", stooq: "^sx5e" },
  { id: "ibex35", name: "IBEX 35", region: "España", yahoo: "^IBEX", stooq: "^ibex" },
  { id: "dax", name: "DAX 40", region: "Alemania", yahoo: "^GDAXI", stooq: "^dax" },
  { id: "nikkei225", name: "Nikkei 225", region: "Japón", yahoo: "^N225", stooq: "^nkx" },
]

const UA = { "User-Agent": "Mozilla/5.0 (compatible; jacobo-web/1.0)" }

async function fromYahoo(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=5y&interval=1d`
  const res = await fetch(url, { headers: UA })
  if (!res.ok) throw new Error(`Yahoo ${res.status}`)
  const json = await res.json()
  const r = json.chart?.result?.[0]
  const ts = r?.timestamp ?? []
  const close = r?.indicators?.quote?.[0]?.close ?? []
  const points = ts
    .map((t, i) => [new Date(t * 1000).toISOString().slice(0, 10), close[i]])
    .filter(([, c]) => typeof c === "number")
  if (points.length < 50) throw new Error("Yahoo: pocos datos")
  return points
}

async function fromStooq(symbol) {
  const res = await fetch(`https://stooq.com/q/d/l/?s=${encodeURIComponent(symbol)}&i=d`, { headers: UA })
  if (!res.ok) throw new Error(`Stooq ${res.status}`)
  const rows = (await res.text()).trim().split("\n").slice(1)
  const since = new Date()
  since.setFullYear(since.getFullYear() - 5)
  const points = rows
    .map((l) => l.split(","))
    .map(([d, , , , c]) => [d, Number(c)])
    .filter(([d, c]) => Number.isFinite(c) && new Date(d) >= since)
  if (points.length < 50) throw new Error("Stooq: pocos datos")
  return points
}

const round = (n) => Math.round(n * 100) / 100

// Último año en diario; el resto, semanal (para que el JSON pese poco)
function compact(points) {
  const cut = new Date()
  cut.setFullYear(cut.getFullYear() - 1)
  const cutStr = cut.toISOString().slice(0, 10)
  const out = []
  let lastWeek = ""
  for (const [d, c] of points) {
    if (d >= cutStr) {
      out.push([d, round(c)])
      continue
    }
    const dt = new Date(d)
    const week = `${dt.getUTCFullYear()}-${Math.floor((dt - new Date(Date.UTC(dt.getUTCFullYear(), 0, 1))) / 6048e5)}`
    if (week !== lastWeek) out.push([d, round(c)])
    lastWeek = week
  }
  return out
}

let previous = {}
try {
  previous = JSON.parse(await readFile(OUT, "utf8"))
} catch {}

const result = { updated: new Date().toISOString(), indices: [] }
let ok = 0
for (const idx of INDICES) {
  let series = null
  for (const [src, fn] of [["yahoo", () => fromYahoo(idx.yahoo)], ["stooq", () => fromStooq(idx.stooq)]]) {
    try {
      series = compact(await fn())
      console.log(`✓ ${idx.name} (${src}): ${series.length} puntos`)
      break
    } catch (e) {
      console.warn(`· ${idx.name} (${src}): ${e.message}`)
    }
  }
  if (series) ok++
  else series = previous.indices?.find((p) => p.id === idx.id)?.series ?? []
  result.indices.push({ id: idx.id, name: idx.name, region: idx.region, series })
}

if (ok === 0 && previous.indices) {
  console.warn("Sin conexión con las fuentes: se mantiene el JSON anterior.")
} else {
  if (ok === 0) result.updated = null
  await writeFile(OUT, JSON.stringify(result) + "\n")
  console.log(`Guardado ${OUT.pathname} (${ok}/${INDICES.length} índices actualizados)`)
}

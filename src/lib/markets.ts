import indicesData from "../data/indices.json"
import newsData from "../data/news.json"

export type Point = [string, number]
export type Index = { id: string; name: string; region: string; series: Point[] }
export type News = { title: string; link: string; source: string; date: string }

export const indices = (indicesData.indices as Index[]).filter((i) => i.series.length > 1)
export const marketsUpdated = indicesData.updated as string | null
export const news = (newsData.items ?? []) as News[]
export const newsUpdated = (newsData as { updated: string | null }).updated

export const fmt = (n: number, d = 0) => n.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d })
export const pct = (n: number) => `${n >= 0 ? "+" : "−"}${fmt(Math.abs(n), 2)} %`

// Último cierre y variación diaria de cada índice
export const quotes = indices.map((i) => {
  const s = i.series
  const last = s[s.length - 1][1]
  const prev = s[s.length - 2][1]
  return { id: i.id, name: i.name, region: i.region, last, day: (last / prev - 1) * 100 }
})

export function yearChange(s: Point[]) {
  const last = s[s.length - 1]
  const cut = new Date(last[0])
  cut.setFullYear(cut.getFullYear() - 1)
  const from = s.find(([d]) => new Date(d) >= cut) ?? s[0]
  return (last[1] / from[1] - 1) * 100
}

export function sparkPath(s: Point[], w = 120, h = 36) {
  const pts = s.slice(-260)
  const vals = pts.map((p) => p[1])
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  return pts
    .map((p, i) => `${i ? "L" : "M"}${((i / (pts.length - 1)) * w).toFixed(1)} ${(h - 2 - ((p[1] - min) / (max - min || 1)) * (h - 4)).toFixed(1)}`)
    .join(" ")
}

export function timeAgo(iso: string, now = new Date()) {
  const m = Math.round((+now - +new Date(iso)) / 60000)
  if (m < 60) return `hace ${Math.max(1, m)} min`
  const h = Math.round(m / 60)
  if (h < 24) return `hace ${h} h`
  const d = Math.round(h / 24)
  return d === 1 ? "ayer" : `hace ${d} días`
}

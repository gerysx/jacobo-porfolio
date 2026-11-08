// Recoge titulares de medios financieros (RSS) y los guarda en src/data/news.json.
// Solo título, medio, fecha y enlace a la noticia original.
// Si todas las fuentes fallan, se conserva el JSON anterior.
import { readFile, writeFile } from "node:fs/promises"
import { XMLParser } from "fast-xml-parser"

const OUT = new URL("../src/data/news.json", import.meta.url)

const FEEDS = [
  { source: "Expansión", url: "https://e00-expansion.uecdn.es/rss/mercados.xml" },
  { source: "Cinco Días", url: "https://feeds.elpais.com/mrss-s/pages/ep/site/cincodias.elpais.com/section/mercados-financieros/portada" },
  { source: "elEconomista", url: "https://www.eleconomista.es/rss/rss-mercados.php" },
  { source: "Investing.com", url: "https://es.investing.com/rss/news_25.rss" },
  { source: "Bolsamanía", url: "https://www.bolsamania.com/rss/noticias-bolsa.xml" },
]
const MAX_PER_SOURCE = 8
const MAX_TOTAL = 30
const MAX_AGE_DAYS = 7

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" })
const text = (v) => (typeof v === "object" && v !== null ? v["#text"] ?? "" : v ?? "").toString()
const clean = (s) =>
  text(s)
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim()

async function readFeed({ source, url }) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; jacobo-web/1.0)" }, signal: AbortSignal.timeout(15000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const xml = parser.parse(await res.text())
  const raw = xml.rss?.channel?.item ?? xml.feed?.entry ?? []
  const items = (Array.isArray(raw) ? raw : [raw])
    .map((it) => {
      const link = typeof it.link === "object" ? it.link.href ?? text(it.link) : it.link
      const date = new Date(it.pubDate ?? it.updated ?? it.published ?? it["dc:date"] ?? Date.now())
      return { title: clean(it.title), link: text(link).trim(), source, date: isNaN(+date) ? new Date().toISOString() : date.toISOString() }
    })
    .filter((i) => i.title && i.link.startsWith("http"))
  if (!items.length) throw new Error("sin noticias")
  return items.slice(0, MAX_PER_SOURCE)
}

let previous = { items: [] }
try {
  previous = JSON.parse(await readFile(OUT, "utf8"))
} catch {}

const fresh = []
for (const feed of FEEDS) {
  try {
    const items = await readFeed(feed)
    fresh.push(...items)
    console.log(`✓ ${feed.source}: ${items.length}`)
  } catch (e) {
    console.warn(`· ${feed.source}: ${e.message}`)
  }
}

if (!fresh.length) {
  console.warn("Ninguna fuente respondió: se mantiene el JSON anterior.")
  if (!previous.updated) await writeFile(OUT, JSON.stringify({ updated: null, items: [] }) + "\n")
} else {
  const cutoff = Date.now() - MAX_AGE_DAYS * 864e5
  const seen = new Set()
  const items = [...fresh, ...(previous.items ?? [])]
    .filter((i) => new Date(i.date).getTime() >= cutoff)
    .filter((i) => {
      const key = i.title.toLowerCase().slice(0, 70)
      if (seen.has(key) || seen.has(i.link)) return false
      seen.add(key)
      seen.add(i.link)
      return true
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, MAX_TOTAL)
  await writeFile(OUT, JSON.stringify({ updated: new Date().toISOString(), items }) + "\n")
  console.log(`Guardadas ${items.length} noticias`)
}

// Cotizaciones de las principales empresas (último mes, diario) para el panel lateral.
// Guarda src/data/stocks.json. Si una empresa falla se conserva su dato anterior.
import { readFile, writeFile } from "node:fs/promises"

const OUT = new URL("../src/data/stocks.json", import.meta.url)

const GROUPS = {
  es: [
    ["SAN.MC", "Banco Santander"],
    ["ITX.MC", "Inditex"],
    ["IBE.MC", "Iberdrola"],
    ["BBVA.MC", "BBVA"],
    ["CABK.MC", "CaixaBank"],
    ["REP.MC", "Repsol"],
    ["TEF.MC", "Telefónica"],
    ["FER.MC", "Ferrovial"],
    ["AENA.MC", "Aena"],
    ["AMS.MC", "Amadeus"],
  ],
  us: [
    ["NVDA", "NVIDIA"],
    ["AAPL", "Apple"],
    ["MSFT", "Microsoft"],
    ["AMZN", "Amazon"],
    ["GOOGL", "Alphabet"],
    ["META", "Meta"],
    ["TSLA", "Tesla"],
    ["BRK-B", "Berkshire Hathaway"],
    ["JPM", "JPMorgan"],
    ["V", "Visa"],
  ],
}

const UA = { "User-Agent": "Mozilla/5.0 (compatible; jacobo-web/1.0)" }

async function quote(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1mo&interval=1d`
  const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(15000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const r = (await res.json()).chart?.result?.[0]
  const close = (r?.indicators?.quote?.[0]?.close ?? []).filter((c) => typeof c === "number")
  if (close.length < 2) throw new Error("pocos datos")
  const last = r.meta?.regularMarketPrice ?? close[close.length - 1]
  const prev = close[close.length - 2]
  return {
    last: Math.round(last * 100) / 100,
    change: Math.round((last / prev - 1) * 10000) / 100,
    currency: r.meta?.currency ?? "",
    spark: close.map((c) => Math.round(c * 100) / 100),
  }
}

let previous = {}
try {
  previous = JSON.parse(await readFile(OUT, "utf8"))
} catch {}

const out = { updated: null, groups: {} }
let ok = 0
for (const [group, list] of Object.entries(GROUPS)) {
  out.groups[group] = []
  for (const [symbol, name] of list) {
    const old = previous.groups?.[group]?.find((s) => s.symbol === symbol)
    try {
      out.groups[group].push({ symbol, name, ...(await quote(symbol)) })
      ok++
    } catch (e) {
      console.warn(`· ${name}: ${e.message}`)
      if (old) out.groups[group].push(old)
    }
  }
}
out.updated = ok ? new Date().toISOString() : previous.updated ?? null
await writeFile(OUT, JSON.stringify(out) + "\n")
console.log(`Cotizaciones: ${ok} empresas actualizadas`)

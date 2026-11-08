// Worker de Cloudflare: sirve la web estática y expone una pequeña API de cotizaciones (/api/*)
// que consulta Yahoo Finance desde el servidor (el navegador no puede hacerlo directamente por CORS).

const YF = "https://query1.finance.yahoo.com"
const HEADERS = { "User-Agent": "Mozilla/5.0 (compatible; jalvarezinvest/1.0)", Accept: "application/json" }
const TYPES = new Set(["EQUITY", "ETF", "INDEX", "MUTUALFUND"])
const DAY = 86400

const json = (data, status = 200, maxAge = 300) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": `public, max-age=${maxAge}` },
  })

async function yahoo(path) {
  const res = await fetch(YF + path, { headers: HEADERS, cf: { cacheTtl: 300, cacheEverything: true } })
  if (!res.ok) throw new Error(`Yahoo ${res.status}`)
  return res.json()
}

const cleanSymbol = (s) => (s || "").trim().toUpperCase().replace(/[^A-Z0-9.^=\-]/g, "").slice(0, 20)

async function search(q) {
  q = (q || "").trim().slice(0, 40)
  if (q.length < 1) return []
  const d = await yahoo(`/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=8&newsCount=0&lang=es-ES&region=ES`)
  return (d.quotes || [])
    .filter((x) => x.symbol && TYPES.has(x.quoteType))
    .map((x) => ({ symbol: x.symbol, name: x.longname || x.shortname || x.symbol, exchange: x.exchDisp || x.exchange || "", type: x.quoteType }))
}

function parseChart(d) {
  const r = d?.chart?.result?.[0]
  if (!r || !r.timestamp) throw new Error("Sin datos")
  const q = r.indicators?.quote?.[0] || {}
  const adj = r.indicators?.adjclose?.[0]?.adjclose || q.close
  const rows = []
  r.timestamp.forEach((t, i) => {
    if (q.close?.[i] != null && adj?.[i] != null) rows.push({ t, close: q.close[i], adj: adj[i] })
  })
  return { meta: r.meta, rows }
}

const day = (t) => new Date(t * 1000).toISOString().slice(0, 10)
const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d

async function quote(symbol) {
  const { meta, rows } = parseChart(await yahoo(`/v8/finance/chart/${encodeURIComponent(symbol)}?range=1y&interval=1d`))
  const last = meta.regularMarketPrice ?? rows.at(-1).close
  const prev = rows.length > 1 ? rows.at(-2).close : null
  return {
    symbol: meta.symbol,
    name: meta.longName || meta.shortName || meta.symbol,
    currency: meta.currency,
    exchange: meta.fullExchangeName || meta.exchangeName || "",
    last: round(last, 4),
    day: prev ? round(((last - prev) / prev) * 100) : null,
    year: round(((last - rows[0].close) / rows[0].close) * 100),
    series: rows.map((r) => [day(r.t), round(r.close, 4)]),
  }
}

async function calc(symbol, date, amount) {
  const start = Math.floor(Date.parse(date + "T00:00:00Z") / 1000)
  const now = Math.floor(Date.now() / 1000)
  if (!Number.isFinite(start) || start > now - DAY) throw new Error("Fecha no válida")
  if (!(amount > 0) || amount > 1e9) throw new Error("Importe no válido")
  const years = (now - start) / (365.25 * DAY)
  const interval = years > 3 ? "1wk" : "1d"
  // Precio del primer día de cotización desde la fecha elegida (con precisión diaria)
  const first = parseChart(await yahoo(`/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${start}&period2=${start + 12 * DAY}&interval=1d&events=div,split`))
  // Evolución hasta hoy para el gráfico y el valor final
  const hist = parseChart(await yahoo(`/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${start}&period2=${now}&interval=${interval}&events=div,split`))
  const s = first.rows[0]
  if (!s) throw new Error("No hay cotización para esa fecha")
  const e = hist.rows.at(-1)
  const total = e.adj / s.adj // con dividendos reinvertidos
  const price = e.close / s.close // solo precio (ajustado por splits)
  const yrs = (e.t - s.t) / (365.25 * DAY)
  return {
    symbol: hist.meta.symbol,
    name: hist.meta.longName || hist.meta.shortName || hist.meta.symbol,
    currency: hist.meta.currency,
    from: day(s.t),
    to: day(e.t),
    amount,
    value: round(amount * total),
    totalPct: round((total - 1) * 100),
    pricePct: round((price - 1) * 100),
    valuePriceOnly: round(amount * price),
    cagr: yrs >= 1 ? round((total ** (1 / yrs) - 1) * 100) : null,
    // Escalada para que termine en el valor actual (la serie semanal puede no empezar justo en el día de compra)
    series: hist.rows.map((r) => [day(r.t), round((amount * total * r.adj) / e.adj)]),
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request)
    const p = url.searchParams
    try {
      if (url.pathname === "/api/search") return json({ results: await search(p.get("q")) }, 200, 3600)
      const symbol = cleanSymbol(p.get("symbol"))
      if (!symbol) return json({ error: "Falta el símbolo" }, 400)
      if (url.pathname === "/api/quote") return json(await quote(symbol))
      if (url.pathname === "/api/calc") return json(await calc(symbol, p.get("date") || "", Number(p.get("amount"))), 200, 1800)
      return json({ error: "No encontrado" }, 404)
    } catch (err) {
      return json({ error: err.message || "Error al consultar los datos" }, 502, 0)
    }
  },
}

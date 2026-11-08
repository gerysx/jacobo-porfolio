// Todo el contenido de la web sale de aquí. Fuente: perfil de LinkedIn de Jacobo.
// No inventar cifras, clientes ni rentabilidades: solo lo que él haya confirmado.

export const PROFILE = {
  name: "Jacobo Álvarez",
  fullName: "Jacobo Álvarez González",
  initials: "JÁ",
  role: "Gestor de banca personal y patrimonial",
  tagline: "Analista de inversiones · Asset allocation y selección de productos",
  location: "Madrid",
  email: "jacoalv97@gmail.com",
  linkedin: "https://www.linkedin.com/in/jacobo-alvarez/",
  languages: ["Español nativo", "Inglés profesional (B2, uso financiero)"],
  summary: [
    "Profesional del sector financiero con más de tres años en banca personal y patrimonial en Madrid.",
    "Mi trabajo diario es analizar mercados, elaborar propuestas de inversión según el perfil de riesgo de cada cliente y hacer seguimiento de carteras en arquitectura abierta, con fondos y otros instrumentos, bajo MiFID II e idoneidad.",
    "Soy European Financial Advisor (EFA) y candidato al CFA Nivel I. Mi objetivo es llevar esa experiencia de propuesta y monitorización de carteras al equipo de análisis de una gestora y al asesoramiento a clientes patrimoniales.",
  ],
}

export const STATS = [
  { value: 300, prefix: "+", suffix: "", label: "Clientes affluent en mi cartera actual, con patrimonios de más de 100.000 €" },
  { value: 450, prefix: "+", suffix: "", label: "Clientes de rentas altas asesorados en inversión" },
  { value: 95, prefix: "+", suffix: "%", label: "Net Promoter Score acompañando carteras en periodos de volatilidad" },
  { value: 35, prefix: "+", suffix: "%", label: "Crecimiento de la penetración de productos de inversión en un año" },
]

// Cómo trabaja una cartera, de principio a fin
export const METHOD = [
  {
    n: "01",
    title: "Conocer al cliente",
    text: "Objetivos, horizonte temporal, tolerancia al riesgo y restricciones. Con el test de idoneidad MiFID II como punto de partida, no como trámite.",
  },
  {
    n: "02",
    title: "Asignación de activos",
    text: "Diseñar el reparto entre renta variable, renta fija, liquidez y alternativos que encaja con ese perfil. Es la decisión que más pesa en el resultado.",
  },
  {
    n: "03",
    title: "Selección en arquitectura abierta",
    text: "Elegir fondos y vehículos de distintas gestoras por calidad, coste y consistencia, sin limitarse a producto propio. Con criterios ESG cuando el cliente lo pide.",
  },
  {
    n: "04",
    title: "Seguimiento y ajuste",
    text: "Revisiones periódicas, rebalanceo cuando la cartera se desvía y cambios cuando cambia la vida del cliente: una herencia, una jubilación, una casa.",
  },
]

export const AREAS = [
  { title: "Asset allocation", text: "Reparto entre clases de activo según perfil y horizonte." },
  { title: "Propuestas por perfil de riesgo", text: "Carteras adaptadas a objetivos y restricciones." },
  { title: "Seguimiento de carteras", text: "Control de desviaciones, rebalanceo e informes." },
  { title: "Arquitectura abierta y fondos", text: "Selección de fondos de distintas gestoras." },
  { title: "Análisis de mercados", text: "Lectura del contexto macro y de los activos." },
  { title: "Reporting de rentabilidad y riesgo", text: "Informes periódicos claros para el cliente." },
  { title: "Optimización fiscal", text: "Eficiencia fiscal en la construcción de la cartera." },
  { title: "MiFID II e idoneidad", text: "Evaluación de idoneidad y cumplimiento normativo." },
]

export const EXPERIENCE = [
  {
    company: "ABANCA",
    role: "Gestor de banca personal y patrimonial",
    period: "may. 2026 — actualidad",
    location: "Madrid",
    points: [
      "Diseño y ejecución de propuestas de inversión en arquitectura abierta según perfil de riesgo, horizonte y restricciones del cliente.",
      "Cartera de más de 300 clientes affluent, con patrimonios superiores a 100.000 €.",
      "Seguimiento continuado de carteras: control del asset allocation, revisión de idoneidad MiFID II y ajustes ante cambios de mercado o de perfil.",
      "Selección de productos e instrumentos para materializar las propuestas, con peso en fondos de inversión.",
    ],
  },
  {
    company: "BBVA",
    role: "Gestor de banca personal",
    period: "jul. 2025 — may. 2026",
    location: "Madrid",
    points: [
      "Asesoramiento de inversión a más de 450 clientes de rentas altas: propuestas, seguimiento de cartera e informes periódicos de rentabilidad y riesgo.",
      "Incremento del 35 % en la penetración de productos de inversión respecto al ejercicio anterior.",
      "Acompañamiento de las carteras en periodos de volatilidad, con un NPS superior al 95 %.",
    ],
  },
  {
    company: "BBVA",
    role: "Gestor comercial",
    period: "jul. 2023 — jun. 2025",
    location: "Madrid",
    points: [
      "Captación y fidelización de particulares, con un 115 % de consecución media sobre objetivos de pasivo y productos de inversión.",
      "Primer contacto estructurado con el catálogo de inversión, base de la posterior especialización en asesoramiento patrimonial.",
    ],
  },
]

export const CERTIFICATIONS = [
  { title: "European Financial Advisor (EFA)", by: "EFPA España" },
  { title: "CFA® Level I Candidate", by: "CFA Institute" },
  { title: "LCCI · Ley de Contratos de Crédito Inmobiliario", by: "EFPA España" },
]

export const EDUCATION = [
  {
    title: "Doble Grado en ADE y Turismo",
    by: "Universidad Rey Juan Carlos",
    period: "2019 — 2024",
  },
  {
    title: "Técnico Superior en Administración y Finanzas",
    by: "IES La Poveda",
    period: "2017 — 2019",
  },
]

export const DISCLAIMER =
  "Esta web es personal e informativa. Su contenido no constituye asesoramiento financiero, recomendación ni oferta de productos, y las opiniones son propias y no representan a ninguna entidad. Rentabilidades pasadas no garantizan rentabilidades futuras."

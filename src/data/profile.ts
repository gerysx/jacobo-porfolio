// Todo el contenido de la web sale de aquí. Fuente: perfil de LinkedIn de Jacobo.
// No inventar cifras, clientes ni rentabilidades: solo lo que él haya confirmado.

export const PROFILE = {
  name: "Jacobo Álvarez",
  initials: "JÁ",
  role: "Gestor de banca personal",
  tagline: "Carteras affluent y asesoramiento de inversión",
  location: "Madrid",
  email: "jacoalv97@gmail.com",
  linkedin: "https://www.linkedin.com/in/jacobo-alvarez/",
  languages: ["Español nativo", "Inglés profesional (B2)"],
  summary: [
    "Gestiono una cartera de clientes affluent en banca personal, con patrimonios superiores a 100.000 €. Antes asesoré a clientes de rentas altas durante casi tres años.",
    "Trabajo con propuestas de inversión en arquitectura abierta, seguimiento del asset allocation, revisión de idoneidad MiFID II y selección de fondos. La relación es cercana y de largo plazo: entender el perfil, el horizonte y las restricciones de cada cliente, y ajustar la cartera cuando cambian.",
    "Soy European Financial Advisor (EFA) y candidato al CFA Nivel I. Mi siguiente paso es la banca privada, con cartera asignada, en Madrid.",
  ],
}

export const STATS = [
  { value: 100, prefix: "+", suffix: "k €", label: "Patrimonio mínimo por cliente en mi cartera actual" },
  { value: 300, prefix: "+", suffix: "", label: "Clientes gestionados en banca comercial" },
  { value: 90, prefix: "+", suffix: "%", label: "Net Promoter Score con mis clientes" },
  { value: 200, prefix: "", suffix: "%", label: "Cumplimiento de objetivos de captación" },
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
  { title: "Fondos de inversión", text: "Selección y combinación de fondos en arquitectura abierta." },
  { title: "Carteras de valores", text: "Seguimiento de posiciones y ajuste al perfil de riesgo." },
  { title: "Planes de pensiones y PIAS", text: "Ahorro a largo plazo con ventajas fiscales." },
  { title: "Seguros", text: "Protección y ahorro, con certificación EFPA Seguros." },
  { title: "Hipotecas y financiación", text: "Asesoramiento acreditado bajo la Ley de Crédito Inmobiliario." },
  { title: "Inversión sostenible", text: "Integración de criterios ESG en la cartera." },
]

export const EXPERIENCE = [
  {
    company: "ABANCA",
    role: "Gestor de banca personal",
    period: "may. 2026 — actualidad",
    location: "Madrid",
    points: [
      "Cartera de clientes affluent con patrimonios superiores a 100.000 €.",
      "Propuestas de inversión en arquitectura abierta y seguimiento del asset allocation.",
      "Revisión de idoneidad MiFID II y selección de fondos.",
    ],
  },
  {
    company: "BBVA",
    role: "Gestor de banca personal",
    period: "jul. 2025 — may. 2026",
    location: "Madrid",
    points: [
      "Gestión y asesoramiento de carteras: fondos, valores, planes de pensiones, PIAS y depósitos.",
      "Asesoramiento en hipotecas y préstamos personales.",
      "Onboarding y captación de clientes, y vinculación con la entidad.",
      "Comercialización y retención de seguros.",
    ],
  },
  {
    company: "BBVA",
    role: "Gestor comercial",
    period: "jul. 2023 — jul. 2025",
    location: "Madrid",
    points: [
      "Más de 300 clientes con soluciones personalizadas y foco en la fidelización.",
      "Net Promoter Score superior al 90 %.",
      "200 % de cumplimiento cuatrimestral en captación de clientes y operaciones de crédito.",
      "Coordinación con riesgos, operaciones y cumplimiento normativo.",
    ],
  },
  {
    company: "ALDI España",
    role: "Colaborador de tienda",
    period: "may. 2020 — jun. 2023",
    location: "Madrid",
    points: ["Atención al cliente y trabajo en equipo mientras cursaba la carrera."],
  },
]

export const CERTIFICATIONS = [
  { title: "European Financial Advisor (EFA)", by: "EFPA España" },
  { title: "CFA® Level I Candidate", by: "CFA Institute" },
  { title: "EFPA Seguros · Nivel 2", by: "EFPA España" },
  { title: "Asesor EFPA · Ley de Contrato de Crédito Inmobiliario", by: "EFPA España" },
  { title: "Asesor en Fondos de Inversión y Cumplimiento Normativo", by: "Certificación profesional" },
  { title: "ESG", by: "Inversión sostenible" },
]

export const EDUCATION = [
  {
    title: "Doble Grado en ADE y Turismo",
    by: "Universidad Rey Juan Carlos",
    period: "2019 — 2024",
  },
  {
    title: "Técnico Superior en Administración y Gestión de Empresas",
    by: "IES La Poveda",
    period: "2015 — 2017",
  },
]

export const DISCLAIMER =
  "Esta web es personal e informativa. Su contenido no constituye asesoramiento financiero, recomendación ni oferta de productos, y las opiniones son propias y no representan a ninguna entidad. Rentabilidades pasadas no garantizan rentabilidades futuras."

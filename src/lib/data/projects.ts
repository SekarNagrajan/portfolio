/**
 * Signature projects shipped at Solverminds Solutions and Technologies.
 * Content framed in the maritime / enterprise domain so viewers understand
 * the real operational scale behind the multi-tenant architecture.
 */
export type Project = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  domain: string;
  period: string;
  techStack: readonly string[];
  highlights: readonly string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  /**
   * Shareable path segment under `/projects`. When omitted, `id` is used.
   */
  slug?: string;
  /**
   * A business outcome you are allowed to publish (time saved, volume,
   * error rate). An empty string hides the metric — do not invent one.
   */
  outcome?: string;
  /** Public image path, for example `/projects/crm.png`. Omit until a file exists. */
  image?: string;
};

export const projects: readonly Project[] = [
  {
    id: "crm",
    title: "CRM — Multi-Tenant Sales Platform",
    tagline: "Tenant-branded sales OS with AI-powered lead capture.",
    description:
      "A multi-tenant CRM for maritime and enterprise sales teams featuring role-based access control, dynamic tenant branding, and an end-to-end lead-to-opportunity lifecycle. OpenAI-powered Voice-to-Text and Image-to-Lead workflows dramatically cut manual data entry across the sales floor.",
    domain: "Sales & Revenue Operations",
    period: "2024 – Present",
    techStack: [
      "React 19",
      "TypeScript",
      "TanStack Router",
      "React Query",
      "Zustand",
      "AG Grid",
      "React Hook Form",
      "Zod",
      "Spring Boot",
      "OpenAI",
      "Google Cloud Vision",
      "N8N",
    ],
    highlights: [
      "Multi-tenant architecture with RBAC and per-tenant branding themes.",
      "Lead, Opportunity, Account, Activity, and Dashboard modules built on AG Grid + React Hook Form + Zod.",
      "Full lead lifecycle — assignment, status tracking, notes, and Lead-to-Opportunity conversion — orchestrated with React Query + Zustand and OpenAPI-generated type-safe clients.",
      "AI-powered Voice-to-Text (OpenAI) and Image-to-Lead (Google Cloud Vision) capture flows.",
      "ECharts productivity dashboards cutting manual data entry across the sales team.",
    ],
    outcome: "",
    featured: true,
  },
  {
    id: "anchor",
    title: "ANCHOR — Vessel Husbanding & Port Operations",
    tagline:
      "The multi-tenant backbone for vessel husbanding, accounting, and port operations.",
    description:
      "A multi-tenant platform used by maritime port agents to run vessel husbanding, EPDA, accounting, vendor payments, and document OCR. Architected ~80% of the frontend shell — the module gating layer, reusable DataTable + transaction UI, and 40+ lazy-loaded screens — integrated to Spring REST APIs over RTK Query. Shipped the ERAX AI chatbot for natural-language queries that generate SQL and render interactive charts.",
    domain: "Maritime — Port Agency & Husbanding",
    period: "2023 – Present",
    techStack: [
      "React 18",
      "TypeScript",
      "Redux Toolkit",
      "RTK Query",
      "Spring Boot 3",
      "Java 17",
      "SQL Server",
      "JWT",
    ],
    highlights: [
      "Architected ~80% of the frontend — app shell, RBAC + module gating, reusable DataTable and transaction UI, and 40+ lazy-loaded screens.",
      "End-to-end EPDA, accounting, and payment UIs (vendor payments, receipts, cheques) plus Husbanding operations.",
      "Document OCR + passport extraction pipeline that reduced manual data entry on vessel calls.",
      "ERAX AI chatbot: natural-language queries → SQL generation → interactive charts rendered inline.",
      "Contributed ~20% backend on VHS financial / EPDA modules over dual SQL Server datasources.",
    ],
    outcome: "",
    featured: true,
  },
  {
    id: "pams-ecommerce",
    title: "PAMS E-Commerce — Shipping Self-Service",
    tagline:
      "Multi-tenant self-service for shipping lines — Booking → B/L → Invoice.",
    description:
      "A multi-tenant shipping self-service platform with dynamic theming, feature flags, and an enterprise design system supporting multiple shipping brands. Core shipping modules — Booking, Shipping Instructions, Bill of Lading, VGM, CRO, Invoice Tracking — alongside operational dashboards with SLA indicators and live vessel schedules.",
    domain: "Maritime — Liner Shipping",
    period: "2023 – 2024",
    techStack: [
      "Next.js 13",
      "React 18",
      "TypeScript",
      "Tailwind CSS",
      "MUI 7",
      "AG Grid",
    ],
    highlights: [
      "Multi-tenant shell with dynamic theming, feature flags, and a shared design system across shipping brands.",
      "Shipping modules: Booking, Shipping Instructions, Bill of Lading, VGM, CRO, Invoice Tracking.",
      "Operational dashboards surfacing SLA indicators and live vessel schedules.",
      "Deep AG Grid integrations for high-density operational data.",
    ],
    outcome: "",
    featured: true,
  },
  {
    id: "pams-legacy",
    title: "PAMS — Multi-Principal Port Agency Platform",
    tagline: "Enterprise port-agency ERP spanning Operations and Commercial.",
    description:
      "A multi-principal port-agency platform covering both Operations and Commercial lanes with LDAP-based RBAC and agency-level security. Shipping modules — Rate Request, Tariff, Surcharge, Load & Discharge Planning, Export Invoice — plus compliance (Detention & Demurrage, GST, VAT, e-Invoicing) and automated EDI batch processes for manifest exchange and invoicing.",
    domain: "Maritime — Multi-Principal Port Agency",
    period: "2023",
    techStack: [
      "JSF",
      "PrimeFaces",
      "Java EE",
      "EJB",
      "CDI",
      "WildFly",
      "SQL Server",
      "Jasper Reports",
      "LDAP",
      "EDI",
    ],
    highlights: [
      "LDAP-based RBAC with agency-level security isolation.",
      "Shipping modules: Rate Request, Tariff, Surcharge, Load & Discharge Planning, Export Invoice.",
      "Compliance features: Detention & Demurrage, GST, VAT, e-Invoicing.",
      "Automated EDI batch processes for manifest exchange and invoicing.",
      "Jasper Reports pipeline for operational and financial reporting.",
    ],
    outcome: "",
  },
] as const;

export const featuredProjects = projects.filter((p) => p.featured);

import { projects, type Project } from "@/lib/data/projects";

/**
 * Long-form case-study content, keyed by project id (which is also the
 * URL slug: /projects/<id>).
 *
 * Every statement here is derived from projects.ts / experiences.ts —
 * no invented metrics. `stats` only uses counts that are verifiable from
 * that data. REVIEW: confirm wording and anything that may be
 * confidential before publishing.
 */
export type ArchitectureLayer = {
  label: string;
  items: readonly string[];
};

export type CaseStudyContent = {
  role: string;
  problem: string;
  approach: readonly { title: string; body: string }[];
  architecture: readonly ArchitectureLayer[];
  impact: readonly string[];
  stats: readonly { value: number; suffix?: string; label: string }[];
};

const content: Record<string, CaseStudyContent> = {
  crm: {
    role: "Architected the multi-tenant frontend and AI capture flows",
    problem:
      "Sales teams across maritime and enterprise tenants were entering leads, notes, and contact details by hand — and every tenant needed its own branding and access rules on the same product.",
    approach: [
      {
        title: "Tenant-aware from the shell down",
        body: "Built a multi-tenant architecture with role-based access control and per-tenant branding themes, so one codebase serves every customer with its own look and permissions.",
      },
      {
        title: "A complete lead lifecycle",
        body: "Lead, Opportunity, Account, Activity, and Dashboard modules on AG Grid + React Hook Form + Zod, covering assignment, status tracking, notes, and Lead-to-Opportunity conversion.",
      },
      {
        title: "Type-safe data layer",
        body: "React Query for server state and Zustand for client state, talking to Spring Boot through OpenAPI-generated, type-safe clients.",
      },
      {
        title: "AI where the typing used to be",
        body: "Voice-to-Text via OpenAI and Image-to-Lead via Google Cloud Vision turn a spoken note or a photo of a business card into a structured lead.",
      },
    ],
    architecture: [
      { label: "Experience", items: ["React 19", "TanStack Router", "AG Grid", "ECharts"] },
      { label: "Forms & state", items: ["React Hook Form", "Zod", "React Query", "Zustand"] },
      { label: "API contract", items: ["OpenAPI clients", "Spring Boot REST", "RBAC"] },
      { label: "AI & automation", items: ["OpenAI", "Google Cloud Vision", "N8N"] },
    ],
    impact: [
      "Eliminated manual data entry across the sales floor with AI-powered capture.",
      "One multi-tenant product with per-tenant branding and role-based access.",
      "End-to-end type safety from form schema to generated API client.",
      "ECharts productivity dashboards for sales teams.",
    ],
    stats: [
      { value: 5, label: "Core CRM modules" },
      { value: 2, label: "AI capture flows" },
      { value: 12, label: "Technologies in the stack" },
    ],
  },
  anchor: {
    role: "Architected ~80% of the frontend; ~20% backend contribution",
    problem:
      "Maritime port agents needed one multi-tenant platform for vessel husbanding, EPDA, accounting, vendor payments, and document handling — with dozens of screens that all behave consistently.",
    approach: [
      {
        title: "An app shell with module gating",
        body: "Designed the application shell with RBAC and module gating, so each tenant and role sees exactly the modules they're entitled to.",
      },
      {
        title: "Reusable building blocks",
        body: "A reusable DataTable and transaction UI underpin 40+ lazy-loaded screens, integrated with Spring REST APIs through RTK Query.",
      },
      {
        title: "Money flows end to end",
        body: "Shipped EPDA, accounting, and payment UIs — vendor payments, receipts, cheques — alongside husbanding operations.",
      },
      {
        title: "Documents and natural-language queries",
        body: "A document OCR and passport-extraction pipeline for vessel calls, plus the ERAX AI chatbot that turns natural-language questions into SQL and renders interactive charts.",
      },
    ],
    architecture: [
      { label: "Experience", items: ["React 18", "TypeScript", "App shell", "40+ lazy screens"] },
      { label: "State & data", items: ["Redux Toolkit", "RTK Query", "DataTable kit"] },
      { label: "Services", items: ["Spring Boot 3", "Java 17", "JWT"] },
      { label: "Data", items: ["SQL Server", "Dual datasources", "OCR pipeline"] },
    ],
    impact: [
      "Reduced manual data entry on vessel calls via document OCR and passport extraction.",
      "Consistent behaviour across 40+ screens through a shared DataTable and transaction UI.",
      "Natural-language reporting: ERAX generates SQL and renders charts inline.",
      "Backend contribution on VHS financial / EPDA modules over dual SQL Server datasources.",
    ],
    stats: [
      { value: 80, suffix: "%", label: "Of the frontend architected" },
      { value: 40, suffix: "+", label: "Lazy-loaded screens" },
      { value: 20, suffix: "%", label: "Backend contribution" },
    ],
  },
  "pams-ecommerce": {
    role: "Built the multi-tenant shell and core shipping modules",
    problem:
      "Shipping lines needed a self-service portal where customers move from Booking to Bill of Lading to Invoice — under multiple brands that each look like their own product.",
    approach: [
      {
        title: "Brandable multi-tenant shell",
        body: "Dynamic theming, feature flags, and an enterprise design system shared across shipping brands.",
      },
      {
        title: "The core shipping journey",
        body: "Booking, Shipping Instructions, Bill of Lading, VGM, CRO, and Invoice Tracking modules.",
      },
      {
        title: "Operational visibility",
        body: "Dashboards surfacing SLA indicators and live vessel schedules.",
      },
      {
        title: "High-density data",
        body: "Deep AG Grid integrations for operational data at volume.",
      },
    ],
    architecture: [
      { label: "Experience", items: ["Next.js 13", "React 18", "TypeScript"] },
      { label: "Design system", items: ["MUI 7", "Tailwind CSS", "Dynamic theming"] },
      { label: "Data views", items: ["AG Grid", "SLA dashboards", "Vessel schedules"] },
      { label: "Platform", items: ["Feature flags", "Multi-tenant shell"] },
    ],
    impact: [
      "Self-service for the full Booking → B/L → Invoice journey.",
      "Multiple shipping brands served from one design system.",
      "SLA indicators and live vessel schedules on operational dashboards.",
    ],
    stats: [
      { value: 6, label: "Core shipping modules" },
      { value: 6, label: "Technologies in the stack" },
    ],
  },
  "pams-legacy": {
    role: "Delivered multi-principal port-agency modules",
    problem:
      "A port agency working for multiple principals needed Operations and Commercial workflows, strict agency-level security, and regulatory compliance in one ERP.",
    approach: [
      {
        title: "Security per agency",
        body: "LDAP-based RBAC with agency-level security isolation.",
      },
      {
        title: "Commercial and operational modules",
        body: "Rate Request, Tariff, Surcharge, Load & Discharge Planning, and Export Invoice.",
      },
      {
        title: "Compliance built in",
        body: "Detention & Demurrage, GST, VAT, and e-Invoicing.",
      },
      {
        title: "Automation and reporting",
        body: "Automated EDI batch processes for manifest exchange and invoicing, plus a Jasper Reports pipeline for operational and financial reporting.",
      },
    ],
    architecture: [
      { label: "Experience", items: ["JSF", "PrimeFaces"] },
      { label: "Application", items: ["Java EE", "EJB", "CDI", "WildFly"] },
      { label: "Security", items: ["LDAP", "Agency-level RBAC"] },
      { label: "Data & integration", items: ["SQL Server", "EDI batches", "Jasper Reports"] },
    ],
    impact: [
      "Operations and Commercial lanes in a single multi-principal platform.",
      "Compliance coverage for D&D, GST, VAT, and e-Invoicing.",
      "Manifest exchange and invoicing automated through EDI batches.",
    ],
    stats: [
      { value: 5, label: "Shipping modules" },
      { value: 4, label: "Compliance features" },
      { value: 10, label: "Technologies in the stack" },
    ],
  },
};

export type CaseStudy = Project & CaseStudyContent & { slug: string };

export const caseStudies: readonly CaseStudy[] = projects
  .filter((p) => content[p.id])
  .map((p) => ({ ...p, ...content[p.id]!, slug: p.slug || p.id }));

export function getCaseStudy(slug: string) {
  const index = caseStudies.findIndex((c) => c.slug === slug);
  if (index === -1) return null;
  return {
    study: caseStudies[index]!,
    prev: caseStudies[(index - 1 + caseStudies.length) % caseStudies.length]!,
    next: caseStudies[(index + 1) % caseStudies.length]!,
  };
}

/**
 * Professional experience timeline.
 * Employer context sourced from https://www.solverminds.com/ — a maritime
 * enterprise system vendor shipping multi-tenant platforms since 2003.
 */
export type Experience = {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  companyContext?: string;
  location: string;
  period: string;
  summary: string;
  technologies: readonly string[];
  achievements: readonly string[];
};

export const experiences: readonly Experience[] = [
  {
    id: "solverminds",
    role: "Software Engineer",
    company: "Solverminds Solutions and Technologies",
    companyUrl: "https://www.solverminds.com/",
    companyContext:
      "Maritime enterprise system vendor since 2003 — 36 products (31 operational + 5 AI) on one data layer, powering Liner, Ship Management, NVOCC, Feeder, Agency, Tanker, and Bulk operators. Offices in Chennai (HQ), Dubai, Singapore, Hamburg, Yeongwol-gun, and Rio de Janeiro. Certified ISO/IEC 27001:2022, CMMI Level 3, ISO 14064-1, and ITIL V4.",
    location: "Chennai, India (SIPCOT IT Park, Siruseri)",
    period: "Oct 2023 – Present",
    summary:
      "Full-stack engineer on the maritime enterprise platform — leading frontend architecture across CRM, ANCHOR, and PAMS product lines while contributing to Spring Boot services and SQL Server data layers.",
    technologies: [
      "React 19",
      "TypeScript",
      "TanStack Router",
      "React Query",
      "Zustand",
      "Redux Toolkit",
      "Spring Boot 4",
      "Java 21",
      "SQL Server",
      "OpenAI",
      "Google Cloud Vision",
      "N8N",
    ],
    achievements: [
      "Architected a multi-tenant CRM featuring role-based access control, dynamic tenant branding, and full lead-to-opportunity lifecycle with React Query + Zustand and OpenAPI-generated clients.",
      "Integrated AI-powered Voice-to-Text and Image-to-Lead capture using OpenAI and Google Cloud Vision — eliminated manual data entry across the sales floor.",
      "Architected ~80% of the ANCHOR vessel-husbanding frontend — app shell, RBAC + module gating, reusable DataTable + transaction UI, and 40+ lazy-loaded screens integrated to Spring REST APIs via RTK Query.",
      "Shipped end-to-end EPDA, accounting, and payment UIs (vendor payments, receipts, cheques) plus the ERAX AI chatbot for natural-language SQL generation and interactive charting.",
      "Contributed ~20% backend on VHS financial / EPDA modules over dual SQL Server datasources.",
      "Built the PAMS E-Commerce multi-tenant shell with dynamic theming, feature flags, and core shipping modules — Booking, Shipping Instructions, B/L, VGM, CRO, Invoice Tracking — on Next.js 13 + MUI 7 + AG Grid.",
      "Delivered PAMS Legacy multi-principal port-agency modules (Rate Request, Tariff, Surcharge, Load & Discharge, Export Invoice) with LDAP-based RBAC and EDI batch automation on JSF/PrimeFaces + WildFly.",
    ],
  },
] as const;

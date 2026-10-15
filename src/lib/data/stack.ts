import type { TechLogoName } from "@/components/icons/TechLogos";

/**
 * Curated tech stack for the home-page showcase — the tools used most in
 * production, grouped by layer. (The exhaustive list lives in skills.ts.)
 */
export type StackItem = {
  name: string;
  /** Simple Icons key; omit to render `monogram` instead. */
  logo?: TechLogoName;
  monogram?: string;
  /** How it's used in practice — one short line. */
  use: string;
};

export type StackCategory = {
  id: string;
  label: string;
  items: readonly StackItem[];
};

export const stack: readonly StackCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    items: [
      { name: "React 19", logo: "react", use: "Primary UI runtime across CRM & ANCHOR" },
      { name: "TypeScript", logo: "typescript", use: "Strict typing end to end" },
      { name: "Next.js", logo: "nextdotjs", use: "PAMS E-Commerce shell, this site" },
      { name: "TanStack Router + Query", logo: "tanstack", use: "Type-safe routing & server state" },
      { name: "Redux Toolkit", logo: "redux", use: "RTK Query over Spring REST" },
      { name: "Zustand", monogram: "Zu", use: "Lightweight client state" },
      { name: "Tailwind CSS", logo: "tailwindcss", use: "Design-system styling" },
      { name: "MUI", logo: "mui", use: "Enterprise component library" },
      { name: "Nx", logo: "nx", use: "Monorepo tooling" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    items: [
      { name: "Java 21", logo: "openjdk", use: "Service language of choice" },
      { name: "Spring Boot 4", logo: "springboot", use: "REST services & batch jobs" },
      { name: "Spring Security", logo: "springsecurity", use: "Auth, RBAC, method security" },
      { name: "JWT", logo: "jsonwebtokens", use: "Stateless API auth" },
      { name: "Hibernate / JPA", logo: "hibernate", use: "ORM over SQL Server" },
      { name: "OpenAPI", logo: "swagger", use: "Generated type-safe clients" },
      { name: "WildFly", monogram: "WF", use: "Java EE runtime for PAMS" },
    ],
  },
  {
    id: "data",
    label: "Data",
    items: [
      { name: "SQL Server", monogram: "SQL", use: "Multi-datasource deployments" },
      { name: "Redis", logo: "redis", use: "Caching layer" },
      { name: "Jasper Reports", monogram: "JR", use: "Operational & financial reports" },
    ],
  },
  {
    id: "ai",
    label: "AI & Automation",
    items: [
      { name: "OpenAI", monogram: "AI", use: "Voice-to-Text, NL→SQL chatbot" },
      { name: "Google Cloud Vision", logo: "googlecloud", use: "Image-to-Lead OCR" },
      { name: "n8n", logo: "n8n", use: "Workflow automation" },
      { name: "LangChain", logo: "langchain", use: "LLM orchestration" },
    ],
  },
  {
    id: "tools",
    label: "Tooling",
    items: [
      { name: "Git", logo: "git", use: "Version control" },
      { name: "GitHub", logo: "github", use: "Code review & CI" },
      { name: "Maven", logo: "apachemaven", use: "JVM builds" },
      { name: "Postman", logo: "postman", use: "API testing" },
      { name: "Jira", logo: "jira", use: "Delivery tracking" },
      { name: "Android Studio", logo: "androidstudio", use: "React Native builds" },
    ],
  },
];

export const stackCount = stack.reduce((n, c) => n + c.items.length, 0);

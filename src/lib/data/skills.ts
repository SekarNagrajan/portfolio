/**
 * Skill matrix — grouped exactly as listed on the resume.
 * Rendered as hover-animated badges on /skills and inline chips on /.
 */
export type SkillGroup = {
  id: string;
  label: string;
  description: string;
  items: readonly string[];
};

export const skillGroups: readonly SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    description: "Statically typed stacks I ship production code in daily.",
    items: ["Java 21", "TypeScript", "JavaScript", "SQL"],
  },
  {
    id: "frontend",
    label: "Frontend",
    description:
      "Enterprise-grade component systems, data grids, and routing.",
    items: [
      "React 19",
      "React 18",
      "React Native",
      "Next.js 15",
      "TanStack Router",
      "React Router",
      "React Query",
      "Redux Toolkit",
      "Zustand",
      "Tailwind CSS",
      "Nx Monorepo",
      "Enterprise Design Systems",
    ],
  },
  {
    id: "backend",
    label: "Backend",
    description: "JVM services, secure REST APIs, and real-time delivery.",
    items: [
      "Spring Boot 4",
      "Spring Security",
      "REST APIs",
      "JWT",
      "JPA / Hibernate",
      "EJB",
      "CDI",
      "Java EE",
      "WildFly",
      "OpenAPI / Swagger",
      "SSE",
      "Web Push",
    ],
  },
  {
    id: "ai",
    label: "AI & Automation",
    description:
      "Shipping LLM, vision, and workflow automation inside enterprise flows.",
    items: [
      "OpenAI API",
      "Google Cloud Vision",
      "AI Chatbots",
      "N8N Workflow Engine",
      "Wispr Flow",
      "LangChain",
    ],
  },
  {
    id: "database",
    label: "Database & Integration",
    description:
      "High-throughput SQL Server deployments, caching, and EDI pipelines.",
    items: [
      "SQL Server",
      "Multi-Datasource Architecture",
      "Stored Procedures",
      "Indexing",
      "Redis",
      "EDI",
      "Batch Processing",
      "Document Processing",
    ],
  },
  {
    id: "tools",
    label: "Tools & Concepts",
    description: "The practice around the code.",
    items: [
      "Git",
      "GitHub",
      "Maven",
      "Android Studio",
      "Postman",
      "JIRA",
      "Jasper Reports",
      "OOP",
      "Data Structures",
      "Design Patterns",
      "Multithreading",
      "Multi-Tenant Architecture",
      "Microservices",
    ],
  },
] as const;

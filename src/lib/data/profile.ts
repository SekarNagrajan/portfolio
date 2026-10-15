/**
 * Single source of truth for identity + socials.
 * Keep in sync with the resume DOCX and public profiles.
 */
export const profile = {
  name: "Sekar Nagarajan",
  firstName: "Sekar",
  title: "Full-Stack Software Engineer",
  tagline:
    "I design and ship scalable multi-tenant platforms with React 19, Spring Boot 4, and Java 21.",
  summary:
    "Full-stack Software Engineer with 3 years of experience shipping high-performance, enterprise-grade applications. Specializing in React 19 / React Native frontends, Spring Boot 4 + Java 21 services, multi-tenant SaaS architectures, secure REST APIs, and AI-driven workflow automation.",
  location: "Chennai, India",
  email: "sekarnagarajan1234@gmail.com",
  phone: "+91 6382802973",
  availability: "Open to senior full-stack and architecture roles",
  /** Shown on About only when non-empty. */
  workAuth: "",
  workMode: "",
  notice: "",
  socials: {
    github: "https://github.com/SekarNagarajan07",
    linkedin: "https://linkedin.com/in/sekar-nagarajan07",
    email: "mailto:sekarnagarajan1234@gmail.com",
  },
} as const;

export type Profile = typeof profile;

export type Education = {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  score: string;
};

export const education: readonly Education[] = [
  {
    id: "mec",
    degree: "Bachelor of Engineering in Computer Science and Engineering",
    institution: "Mahendra Engineering College",
    location: "Namakkal, Tamil Nadu, India",
    period: "Aug 2019 – Jul 2023",
    score: "CGPA 8.9 / 10",
  },
] as const;

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  period: string;
};

export const certifications: readonly Certification[] = [
  {
    id: "accord-react-spring",
    title: "React JS & Spring Boot — Certified Course",
    issuer: "Accord Info Matrix Pvt. Ltd.",
    period: "Jul 2023 – Sep 2023",
  },
] as const;

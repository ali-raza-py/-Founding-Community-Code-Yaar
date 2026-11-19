import type { ApplicationData } from "@/types/application";

export const EMPTY_APPLICATION: ApplicationData = {
  fullName: "",
  email: "",
  country: "",
  city: "",
  region: "",
  ageRange: "",
  educationLevel: "",
  institution: "",
  fieldOfStudy: "",
  yearOrGrade: "",
  experienceLevel: "",
  languages: "",
  previousProjects: "",
  github: "",
  linkedin: "",
  portfolio: "",
  motivation: "",
  learningGoals: "",
  contribution: "",
  weeklyTime: "",
  preferredLanguage: "",
  timezone: "",
};

/** Groups used by the review step so applicants can edit a step from one place. */
export const REVIEW_GROUPS = [
  {
    step: 1,
    title: "Personal information",
    fields: [
      { key: "fullName", label: "Full name" },
      { key: "email", label: "Email address" },
      { key: "country", label: "Country" },
      { key: "city", label: "City" },
      { key: "region", label: "Region / state" },
      { key: "ageRange", label: "Age range" },
    ],
  },
  {
    step: 2,
    title: "Education",
    fields: [
      { key: "educationLevel", label: "Education level" },
      { key: "institution", label: "School / college / university" },
      { key: "fieldOfStudy", label: "Field of study" },
      { key: "yearOrGrade", label: "Current year or stage" },
    ],
  },
  {
    step: 3,
    title: "Programming background",
    fields: [
      { key: "experienceLevel", label: "Experience" },
      { key: "languages", label: "Languages and technologies" },
      { key: "previousProjects", label: "Previous projects" },
      { key: "github", label: "GitHub" },
      { key: "linkedin", label: "LinkedIn" },
      { key: "portfolio", label: "Portfolio" },
    ],
  },
  {
    step: 4,
    title: "Motivation and contribution",
    fields: [
      { key: "motivation", label: "Why The First 100" },
      { key: "learningGoals", label: "What you hope to learn" },
      { key: "contribution", label: "What you could contribute" },
      { key: "weeklyTime", label: "Weekly time" },
      { key: "preferredLanguage", label: "Preferred language" },
      { key: "timezone", label: "Time zone" },
    ],
  },
] as const satisfies readonly {
  step: number;
  title: string;
  fields: readonly { key: keyof ApplicationData; label: string }[];
}[];

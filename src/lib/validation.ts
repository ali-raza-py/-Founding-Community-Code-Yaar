import { z } from "zod";

import { AGE_RANGES, EDUCATION_LEVELS, EXPERIENCE_LEVELS, WEEKLY_TIME_OPTIONS } from "@/lib/constants";

const ageValues = AGE_RANGES.map((option) => option.value) as [string, ...string[]];
const educationValues = EDUCATION_LEVELS.map(
  (option) => option.value,
) as [string, ...string[]];
const experienceValues = EXPERIENCE_LEVELS.map(
  (option) => option.value,
) as [string, ...string[]];
const weeklyTimeValues = WEEKLY_TIME_OPTIONS.map(
  (option) => option.value,
) as [string, ...string[]];

function optionalText(max: number) {
  return z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters.`);
}

function optionalUrl(max = 200) {
  return z
    .string()
    .trim()
    .max(max, "This link is too long.")
    .refine(
      (value) => value === "" || /^https?:\/\/[^\s]+\.[^\s]+$/i.test(value),
      "Enter a full link starting with https://",
    );
}

export const personalInformationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(100, "Please keep your name under 100 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .max(254, "This email address is too long.")
    .email("Enter an email address such as you@example.com"),
  country: z
    .string()
    .trim()
    .min(1, "Select your country.")
    .max(80, "Select your country from the list."),
  city: z
    .string()
    .trim()
    .min(1, "Enter your city.")
    .max(80, "Please keep this under 80 characters."),
  region: optionalText(80),
  ageRange: z
    .string()
    .min(1, "Select your age range.")
    .refine((value) => ageValues.includes(value), "Select your age range."),
});

export const educationSchema = z.object({
  educationLevel: z
    .string()
    .min(1, "Select your current education level.")
    .refine(
      (value) => educationValues.includes(value),
      "Select your current education level.",
    ),
  institution: optionalText(120),
  fieldOfStudy: optionalText(100),
  yearOrGrade: z
    .string()
    .trim()
    .min(1, "Tell us your current year, grade, or stage.")
    .max(60, "Please keep this under 60 characters."),
});

export const programmingBackgroundSchema = z.object({
  experienceLevel: z
    .string()
    .min(1, "Select your experience level.")
    .refine(
      (value) => experienceValues.includes(value),
      "Select your experience level.",
    ),
  languages: z
    .string()
    .trim()
    .min(1, "List any languages or technologies, or write “None yet”.")
    .max(300, "Please keep this under 300 characters."),
  previousProjects: optionalText(1000),
  github: optionalUrl(),
  linkedin: optionalUrl(),
  portfolio: optionalUrl(),
});

export const motivationSchema = z.object({
  motivation: z
    .string()
    .trim()
    .min(80, "Please write at least a few sentences (80 characters).")
    .max(1500, "Please keep this under 1500 characters."),
  learningGoals: z
    .string()
    .trim()
    .min(40, "Tell us a little more (at least 40 characters).")
    .max(1000, "Please keep this under 1000 characters."),
  contribution: z
    .string()
    .trim()
    .min(40, "Tell us a little more (at least 40 characters).")
    .max(1000, "Please keep this under 1000 characters."),
  weeklyTime: z
    .string()
    .min(1, "Select the time you can realistically contribute.")
    .refine(
      (value) => weeklyTimeValues.includes(value),
      "Select the time you can realistically contribute.",
    ),
  preferredLanguage: z
    .string()
    .trim()
    .min(1, "Enter your preferred communication language.")
    .max(60, "Please keep this under 60 characters."),
  timezone: z
    .string()
    .trim()
    .min(1, "Enter your time zone, for example “Asia/Karachi (UTC+5)”.")
    .max(60, "Please keep this under 60 characters."),
});

export const applicationSchema = personalInformationSchema
  .merge(educationSchema)
  .merge(programmingBackgroundSchema)
  .merge(motivationSchema);

import { z } from "zod";

import {
  APPLYING_FOR_OPTIONS,
  EDUCATION_LEVELS,
  EXPERIENCE_LEVELS,
  WEEKLY_TIME_OPTIONS,
  AMBASSADOR_AGE_RANGES,
  AMBASSADOR_CATEGORIES,
  AMBASSADOR_CURRENT_STATUS,
  AMBASSADOR_WEEKLY_TIME_OPTIONS,
} from "@/lib/constants";

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
  age: z
    .number()
    .min(13, "You must be at least 13 years old to apply.")
    .max(120, "Please enter a valid age.")
    .refine((value) => Number.isInteger(value), "Please enter a whole number."),
  applyingFor: z
    .string()
    .min(1, "Select what you are applying for.")
    .refine(
      (value) => APPLYING_FOR_OPTIONS.some((o) => o.value === value),
      "Select what you are applying for.",
    ),
});

export const educationSchema = z.object({
  educationLevel: z
    .string()
    .min(1, "Select your current education level.")
    .refine(
      (value) => educationValues.includes(value),
      "Select your current education level.",
    ),
  institution: z
    .string()
    .trim()
    .min(1, "Institution is required.")
    .max(120, "Please keep this under 120 characters."),
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

/* ========================================================================
   Ambassador application validation schemas
   ======================================================================== */

const ambassadorAgeValues = AMBASSADOR_AGE_RANGES.map(
  (option) => option.value,
) as [string, ...string[]];
const ambassadorCategoryValues = AMBASSADOR_CATEGORIES.map(
  (option) => option.value,
) as [string, ...string[]];
const ambassadorStatusValues = AMBASSADOR_CURRENT_STATUS.map(
  (option) => option.value,
) as [string, ...string[]];
const ambassadorWeeklyTimeValues = AMBASSADOR_WEEKLY_TIME_OPTIONS.map(
  (option) => option.value,
) as [string, ...string[]];

export const ambassadorPersonalSchema = z.object({
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
  ageRange: z
    .string()
    .min(1, "Select your age range.")
    .refine((value) => ambassadorAgeValues.includes(value), "Select your age range."),
  currentStatus: z
    .string()
    .min(1, "Select your current status.")
    .refine(
      (value) => ambassadorStatusValues.includes(value),
      "Select your current status.",
    ),
});

export const ambassadorPreferenceSchema = z.object({
  ambassadorCategory: z
    .string()
    .min(1, "Select your preferred ambassador category.")
    .refine(
      (value) => ambassadorCategoryValues.includes(value),
      "Select your preferred ambassador category.",
    ),
  categoryInterest: z
    .string()
    .trim()
    .min(20, "Please tell us more about your interest (at least 20 characters).")
    .max(1000, "Please keep this under 1000 characters."),
});

export const ambassadorEducationSchema = z.object({
  institution: optionalText(120).optional(),
  fieldOfStudy: optionalText(100).optional(),
  belongsToCommunity: z.enum(["yes", "no"]),
  communityName: optionalText(120).optional(),
  communityDescription: z
    .string()
    .trim()
    .min(20, "Please describe the community you can reach or hope to build (at least 20 characters).")
    .max(1000, "Please keep this under 1000 characters."),
  hasLeadershipExperience: z.enum(["yes", "no"]),
});

export const ambassadorOnlinePresenceSchema = z.object({
  linkedin: optionalUrl(),
  github: optionalUrl(),
  instagram: optionalUrl(),
  twitter: optionalUrl(),
  website: optionalUrl(),
});

export const ambassadorMotivationSchema = z.object({
  whyAmbassador: z
    .string()
    .trim()
    .min(80, "Please write at least a few sentences (80 characters).")
    .max(1500, "Please keep this under 1500 characters."),
  howIntroduce: z
    .string()
    .trim()
    .min(80, "Please write at least a few sentences (80 characters).")
    .max(1500, "Please keep this under 1500 characters."),
  whySuitable: z
    .string()
    .trim()
    .min(80, "Please write at least a few sentences (80 characters).")
    .max(1500, "Please keep this under 1500 characters."),
  initiativeIdea: z
    .string()
    .trim()
    .min(80, "Please describe your idea (at least 80 characters).")
    .max(1500, "Please keep this under 1500 characters."),
  first30Days: z
    .string()
    .trim()
    .min(80, "Please describe your first 30 days (at least 80 characters).")
    .max(1500, "Please keep this under 1500 characters."),
});

export const ambassadorAvailabilitySchema = z.object({
  weeklyTime: z
    .string()
    .min(1, "Select your weekly availability.")
    .refine(
      (value) => ambassadorWeeklyTimeValues.includes(value),
      "Select your weekly availability.",
    ),
  canAttendMeetings: z.enum(["yes", "no"]),
});

export const ambassadorAgreementSchema = z.object({
  informationAccurate: z.boolean().refine((v) => v === true, "You must confirm this."),
  noSelectionGuarantee: z.boolean().refine((v) => v === true, "You must confirm this."),
  agreeToGuidelines: z.boolean().refine((v) => v === true, "You must confirm this."),
  consentDataProcessing: z.boolean().refine((v) => v === true, "You must confirm this."),
  guardianConsent: z.boolean().optional(),
});

export const ambassadorSchema = ambassadorPersonalSchema
  .merge(ambassadorPreferenceSchema)
  .merge(ambassadorEducationSchema)
  .merge(ambassadorOnlinePresenceSchema)
  .merge(ambassadorMotivationSchema)
  .merge(ambassadorAvailabilitySchema)
  .merge(ambassadorAgreementSchema);

/* ========================================================================
   Task management validation schemas
   Matches the backend contract for POST /api/v1/admin/tasks:
   { title, description, program_id, assigned_to: string | string[], due_date, status? }
   ======================================================================== */

export const taskCreationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required.")
    .max(200, "Please keep the task title under 200 characters."),
  description: z
    .string()
    .trim()
    .min(1, "Task description is required.")
    .max(2000, "Please keep the description under 2,000 characters."),
  program_id: z
    .string()
    .trim()
    .min(1, "Select a programme.")
    .max(200, "Invalid programme selection."),
  assigned_to: z
    .string()
    .uuid('Invalid participant selection.'),
  due_date: z
    .string()
    .trim()
    .min(1, "Select a deadline.")
    .max(10, "Enter a valid deadline date.")
    .refine(
      (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)),
      "Enter a valid deadline date (YYYY-MM-DD).",
    ),
  status: z
    .enum(["pending", "in_progress", "completed", "overdue"] as const)
    .default("pending")
    .optional(),
});

export type TaskCreationInput = z.infer<typeof taskCreationSchema>;

/* ========================================================================
   Announcement management validation schemas
   Matches the backend contract for POST /api/v1/admin/announcements:
   { title, content, target_program_id?, published? }
   ======================================================================== */

export const announcementCreationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Announcement title is required.")
    .max(200, "Please keep the title under 200 characters."),
  content: z
    .string()
    .trim()
    .min(1, "Announcement content cannot be empty.")
    .max(10000, "Please keep the announcement under 10,000 characters."),
  target_program_id: z
    .string()
    .trim()
    .min(1, "Select a target programme.")
    .optional()
    .nullable(),
  published: z.boolean().default(false).optional(),
});

export type AnnouncementCreationInput = z.infer<typeof announcementCreationSchema>;

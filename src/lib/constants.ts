/**
 * Static campaign metadata and enumerable option lists.
 * Copy that appears in more than one place lives in `src/lib/content`.
 */

export const CAMPAIGN = {
  organization: "Code Yaar",
  initiative: "Code Yaar Global Founding Community",
  campaign: "The First 100",
  program: "Global Founding Cohort 2026–27",
  tagline: "Think. Build. Evolve.",
  coreMessage: "One community. Different countries. One shared ambition.",
  label: "The First 100 · Global Founding Cohort 2026–27",
} as const;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const FORM_VERSION = "1.0.0";

export const TOTAL_STEPS = 5;

export const STEP_LABELS = [
  "Personal",
  "Education",
  "Programming",
  "Motivation",
  "Review",
] as const;

export const AGE_RANGES = [
  { value: "under-16", label: "Under 16" },
  { value: "16-17", label: "16–17" },
  { value: "18-24", label: "18–24" },
  { value: "25-34", label: "25–34" },
  { value: "35-44", label: "35–44" },
  { value: "45-plus", label: "45 and above" },
] as const;

export const EDUCATION_LEVELS = [
  { value: "school", label: "School" },
  { value: "high-school", label: "High school / college" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "postgraduate", label: "Postgraduate" },
  { value: "bootcamp", label: "Bootcamp or online programme" },
  { value: "self-taught", label: "Self-taught" },
  { value: "not-studying", label: "Not currently studying" },
] as const;

export const EXPERIENCE_LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
    description: "Still learning the basics, or have not built much yet.",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Comfortable with one language and a few small projects.",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Building regularly and comfortable with larger codebases.",
  },
] as const;

export const WEEKLY_TIME_OPTIONS = [
  { value: "under-2", label: "Under 2 hours" },
  { value: "2-4", label: "2–4 hours" },
  { value: "5-7", label: "5–7 hours" },
  { value: "8-10", label: "8–10 hours" },
  { value: "10-plus", label: "More than 10 hours" },
] as const;

export const LABEL_LOOKUPS = {
  ageRange: AGE_RANGES,
  educationLevel: EDUCATION_LEVELS,
  experienceLevel: EXPERIENCE_LEVELS,
  weeklyTime: WEEKLY_TIME_OPTIONS,
} as const;

export function labelFor(
  group: keyof typeof LABEL_LOOKUPS,
  value: string,
): string {
  const options = LABEL_LOOKUPS[group] as readonly {
    value: string;
    label: string;
  }[];
  return options.find((option) => option.value === value)?.label ?? value;
}

/**
 * Countries offered in the application. Kept deliberately complete so applicants
 * are not forced into a short curated list.
 */
export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas",
  "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
  "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
  "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
  "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)", "Costa Rica",
  "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti",
  "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
  "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
  "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece",
  "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
  "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
  "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
  "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
  "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "São Tomé and Príncipe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
  "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Türkiye", "Turkmenistan", "Tuvalu", "Uganda",
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
  "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
  "Zambia", "Zimbabwe", "Prefer not to say",
] as const;

export const PRIVACY_CONSENT_TEXT =
  "I have read the privacy information and agree that my application may be reviewed by the Code Yaar team.";

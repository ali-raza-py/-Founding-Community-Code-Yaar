export const privacyStatus =
  "This page describes what the application collects and how it is handled. It is written to be accurate about the current build. It is not legal advice, and it has not yet been reviewed by a lawyer.";

export const dataCategories = [
  {
    category: "Identity and contact",
    fields: "Full name, email address",
    purpose: "To review your application and contact you about the outcome.",
  },
  {
    category: "Location",
    fields: "Country, city, region or state (optional)",
    purpose:
      "To understand where members are joining from and to plan activities around time zones.",
  },
  {
    category: "Age range",
    fields: "Age range only — never a date of birth",
    purpose:
      "To apply our policy for applicants under 18 and to understand the cohort's composition.",
  },
  {
    category: "Education",
    fields: "Education level, institution (optional), field of study (optional), current year or stage",
    purpose: "To understand your current stage and how the cohort can support it.",
  },
  {
    category: "Programming background",
    fields: "Experience level, languages, previous projects (optional)",
    purpose: "To shape activities that suit the cohort's level and interests.",
  },
  {
    category: "Links",
    fields: "GitHub, LinkedIn, portfolio (all optional)",
    purpose:
      "Optional context for reviewers. Applicants without these links are not disadvantaged.",
  },
  {
    category: "Motivation and contribution",
    fields: "Why you want to join, what you hope to learn, what you could contribute",
    purpose: "The main basis for reviewing an application.",
  },
  {
    category: "Availability",
    fields: "Weekly time, preferred communication language, time zone",
    purpose:
      "To set realistic expectations and to schedule activities inclusively.",
  },
];

export const privacySections = [
  {
    id: "collection",
    title: "What we collect and why",
    paragraphs: [
      "We collect only what is needed to review an application and to run the founding cohort. Required fields are marked in the form. Optional fields can be left empty without affecting your application.",
      "We do not ask for a date of birth, home address, phone number, identity documents, government identification numbers, photographs or sensitive personal circumstances.",
    ],
  },
  {
    id: "use",
    title: "How your information is used",
    paragraphs: [
      "Your application is used to decide whether to offer you a place in the founding cohort, and — if you are selected — to onboard you and communicate with you about community activities.",
      "We do not sell your information, use it for advertising, or add you to a marketing list. There is no tracking or analytics on this website.",
    ],
  },
  {
    id: "access",
    title: "Who can access it",
    paragraphs: [
      "Access is limited to the Code Yaar founding team members who review applications and run the cohort. Applications are not published, and they are not visible to other applicants or members.",
      "Application data is transmitted to a submission service that receives the form. That service has not been selected at the time of writing, so its name, location and data-handling terms cannot yet be listed here. This section will be updated with the actual provider before any real application is accepted.",
    ],
  },
  {
    id: "storage",
    title: "Where it is stored and for how long",
    paragraphs: [
      "This website has no database. It sends your application to an external submission endpoint and stores nothing itself.",
      "If you start an application and do not submit it, your answers may be saved in your own browser so you do not lose them. They stay on your device, are not transmitted, and can be deleted at any time with the “Clear saved progress” control on the application page.",
      "A retention period for submitted applications has not been confirmed yet. We will publish one before launch, and it will be stated here rather than described as “as long as necessary”.",
    ],
  },
  {
    id: "rights",
    title: "Your choices and rights",
    paragraphs: [
      "You can ask what information we hold about you, ask for it to be corrected, or ask for it to be deleted. You can also withdraw your application at any time.",
      "A dedicated privacy contact address has not been confirmed yet. Until it is published, this is an acknowledged gap rather than something we can point you to. The address will be added here before applications open.",
    ],
  },
  {
    id: "minors",
    title: "Applicants under 18",
    paragraphs: [
      "The application collects an age range so that we can handle applications from minors carefully. A guardian-consent and safeguarding process is still being finalised, and it must be in place before any applicant under 18 is accepted or onboarded.",
      "If you are under 18, please do not include personal details beyond what the form asks for.",
    ],
  },
  {
    id: "security",
    title: "Security",
    paragraphs: [
      "The application is submitted over an encrypted HTTPS connection to the configured endpoint. Access to submitted applications is limited to the review team.",
      "We do not claim specific security certifications, and we cannot guarantee the security of information beyond the measures described here. No system is perfectly secure.",
    ],
  },
] as const;

export const privacyChanges =
  "If this policy changes in a way that affects how your application is handled, the page will be updated and the change noted here. This page reflects the current frontend-only build and must be updated with the real submission provider before the site is used to collect live applications.";

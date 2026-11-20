import type { z } from "zod";

import type {
  applicationSchema,
  educationSchema,
  motivationSchema,
  personalInformationSchema,
  programmingBackgroundSchema,
} from "@/lib/validation";

export type PersonalInformation = z.infer<typeof personalInformationSchema>;
export type Education = z.infer<typeof educationSchema>;
export type ProgrammingBackground = z.infer<
  typeof programmingBackgroundSchema
>;
export type Motivation = z.infer<typeof motivationSchema>;

/** Every field the applicant can enter, before consent. */
export type ApplicationData = z.infer<typeof applicationSchema>;

export type ApplicationStepValues = Partial<ApplicationData>;

export type ApplicationEnvelope = {
  submissionId: string;
  formVersion: string;
  submittedAt: string;
  application: ApplicationData;
  referralCode: string | null;
};

export type SubmissionFailureReason =
  | "not-configured"
  | "network"
  | "timeout"
  | "rejected"
  | "server";

export type SubmissionResult =
  | { ok: true; reference: string | null }
  | { ok: false; reason: SubmissionFailureReason; status?: number };

export type SubmissionStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; reference: string | null }
  | { state: "error"; reason: SubmissionFailureReason; status?: number };

export type FieldErrors = Record<string, string>;

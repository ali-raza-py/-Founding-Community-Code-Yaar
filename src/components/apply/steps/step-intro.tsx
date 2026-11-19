import type { ApplicationData, FieldErrors } from "@/types/application";

/**
 * Common contract for the four data-entry steps. Field ids match the data
 * keys so validation errors can focus the right control.
 */
export type StepComponentProps = {
  values: ApplicationData;
  errors: FieldErrors;
  onChange: (field: keyof ApplicationData, value: string) => void;
};

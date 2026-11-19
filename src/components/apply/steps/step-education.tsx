import { SelectField, TextField } from "@/components/ui/field";
import { EDUCATION_LEVELS } from "@/lib/constants";

import type { StepComponentProps } from "./step-intro";

export function StepEducation({ values, errors, onChange }: StepComponentProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <SelectField
        id="educationLevel"
        label="Current education level"
        required
        hint="Choose the closest match. There is no preferred answer."
        value={values.educationLevel}
        error={errors.educationLevel}
        onChange={(event) => onChange("educationLevel", event.target.value)}
        className="sm:col-span-2"
      >
        <option value="">Select your current level</option>
        {EDUCATION_LEVELS.map((level) => (
          <option key={level.value} value={level.value}>
            {level.label}
          </option>
        ))}
      </SelectField>

      <TextField
        id="institution"
        label="School, college or university"
        optional
        autoComplete="organization"
        placeholder="Name of your institution"
        value={values.institution}
        error={errors.institution}
        onChange={(event) => onChange("institution", event.target.value)}
      />

      <TextField
        id="fieldOfStudy"
        label="Field of study"
        optional
        placeholder="e.g. Computer Science, Biology, none"
        value={values.fieldOfStudy}
        error={errors.fieldOfStudy}
        onChange={(event) => onChange("fieldOfStudy", event.target.value)}
      />

      <TextField
        id="yearOrGrade"
        label="Current year, grade or stage"
        required
        hint="For example “Grade 11”, “2nd year”, “Final year”, or “Self-directed since 2024”."
        placeholder="Where are you in your studies?"
        value={values.yearOrGrade}
        error={errors.yearOrGrade}
        onChange={(event) => onChange("yearOrGrade", event.target.value)}
        className="sm:col-span-2"
      />
    </div>
  );
}

import { SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { WEEKLY_TIME_OPTIONS } from "@/lib/constants";

import type { StepComponentProps } from "./step-intro";
export function StepMotivation({ values, errors, onChange }: StepComponentProps) {
  const motivationCount = values.motivation.trim().length;

  return (
    <div className="grid gap-6">
      <TextAreaField
        id="motivation"
        label="Why do you want to join The First 100?"
        required
        rows={6}
        hint={`A few honest sentences is enough — no need to sound impressive. ${motivationCount > 0 ? `${motivationCount} characters so far; 80 minimum.` : "80 characters minimum."}`}
        placeholder="What brought you here, and why now?"
        value={values.motivation}
        error={errors.motivation}
        onChange={(event) => onChange("motivation", event.target.value)}
      />

      <TextAreaField
        id="learningGoals"
        label="What do you hope to learn in the next year?"
        required
        rows={4}
        hint="Be specific if you can. “Get better at coding” is a start; “build and deploy my first full website” is easier to help with."
        placeholder="Skills, projects, or habits you want to build"
        value={values.learningGoals}
        error={errors.learningGoals}
        onChange={(event) => onChange("learningGoals", event.target.value)}
      />

      <TextAreaField
        id="contribution"
        label="What could you contribute to a community of learners?"
        required
        rows={4}
        hint="Answering questions, testing other people's projects, writing notes, organising a study group, or simply showing up consistently — all count."
        placeholder="Time, skills, perspective, or support you could offer"
        value={values.contribution}
        error={errors.contribution}
        onChange={(event) => onChange("contribution", event.target.value)}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField
          id="weeklyTime"
          label="Realistic weekly time"
          required
          hint="An honest small number is more useful than an aspirational large one."
          value={values.weeklyTime}
          error={errors.weeklyTime}
          onChange={(event) => onChange("weeklyTime", event.target.value)}
        >
          <option value="">Select a range</option>
          {WEEKLY_TIME_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>

        <TextField
          id="preferredLanguage"
          label="Preferred communication language"
          required
          placeholder="e.g. English, Urdu, Spanish"
          value={values.preferredLanguage}
          error={errors.preferredLanguage}
          onChange={(event) => onChange("preferredLanguage", event.target.value)}
        />
      </div>

      <TextField
        id="timezone"
        label="Time zone"
        required
        hint="For example “Asia/Karachi (UTC+5)” or “America/Bogota (UTC−5)”."
        placeholder="City or UTC offset"
        value={values.timezone}
        error={errors.timezone}
        onChange={(event) => onChange("timezone", event.target.value)}
        className="sm:max-w-[22rem]"
      />
    </div>
  );
}

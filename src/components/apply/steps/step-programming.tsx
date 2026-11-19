import { RadioGroupField, TextAreaField, TextField } from "@/components/ui/field";
import { EXPERIENCE_LEVELS } from "@/lib/constants";

import type { StepComponentProps } from "./step-intro";
export function StepProgramming({ values, errors, onChange }: StepComponentProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <RadioGroupField
          name="experienceLevel"
          legend="How would you describe your programming experience?"
          required
          options={EXPERIENCE_LEVELS}
          value={values.experienceLevel}
          error={errors.experienceLevel}
          onChange={(value) => onChange("experienceLevel", value)}
        />
      </div>

      <TextAreaField
        id="languages"
        label="Languages and technologies you have touched"
        required
        rows={3}
        hint="Python, JavaScript, HTML/CSS, Scratch, a course you finished — anything counts. Write “None yet” if you are starting from zero."
        placeholder="e.g. Python, HTML/CSS, a little JavaScript"
        value={values.languages}
        error={errors.languages}
        onChange={(event) => onChange("languages", event.target.value)}
        className="sm:col-span-2"
      />

      <TextAreaField
        id="previousProjects"
        label="Anything you have built or tried"
        optional
        rows={4}
        hint="Coursework, a class project, a small website, a failed experiment. One or two sentences is enough."
        placeholder="Tell us about a project, or what you tried and learned"
        value={values.previousProjects}
        error={errors.previousProjects}
        onChange={(event) => onChange("previousProjects", event.target.value)}
        className="sm:col-span-2"
      />

      <div className="sm:col-span-2 border-t border-line pt-6">
        <p className="text-[0.9375rem] font-medium text-ink">Links</p>
        <p className="mt-1 max-w-[58ch] text-[0.8125rem] leading-relaxed text-ink-muted">
          GitHub and LinkedIn are required so we can review your work. Leave
          portfolio empty if you do not have one.
        </p>
      </div>

      <TextField
        id="github"
        label="GitHub profile"
        required
        type="url"
        inputMode="url"
        placeholder="https://github.com/username"
        value={values.github}
        error={errors.github}
        onChange={(event) => onChange("github", event.target.value)}
      />

      <TextField
        id="linkedin"
        label="LinkedIn profile"
        required
        type="url"
        inputMode="url"
        placeholder="https://linkedin.com/in/username"
        value={values.linkedin}
        error={errors.linkedin}
        onChange={(event) => onChange("linkedin", event.target.value)}
      />

      <TextField
        id="portfolio"
        label="Portfolio or personal site"
        optional
        type="url"
        inputMode="url"
        placeholder="https://your-site.com"
        value={values.portfolio}
        error={errors.portfolio}
        onChange={(event) => onChange("portfolio", event.target.value)}
        className="sm:col-span-2"
      />
    </div>
  );
}

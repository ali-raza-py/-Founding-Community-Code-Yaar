import { AGE_RANGES, COUNTRIES } from "@/lib/constants";
import { SelectField, TextField } from "@/components/ui/field";

import type { StepComponentProps } from "./step-intro";

export function StepPersonal({ values, errors, onChange }: StepComponentProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <TextField
        id="fullName"
        label="Full name"
        required
        autoComplete="name"
        placeholder="As you would like to be known"
        value={values.fullName}
        error={errors.fullName}
        onChange={(event) => onChange("fullName", event.target.value)}
        className="sm:col-span-2"
      />

      <TextField
        id="email"
        label="Email address"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        hint="The only way we can contact you about this application."
        value={values.email}
        error={errors.email}
        onChange={(event) => onChange("email", event.target.value)}
        className="sm:col-span-2"
      />

      <SelectField
        id="country"
        label="Country"
        required
        autoComplete="country-name"
        value={values.country}
        error={errors.country}
        onChange={(event) => onChange("country", event.target.value)}
        className="sm:col-span-2"
      >
        <option value="">Select your country</option>
        {COUNTRIES.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </SelectField>

      <TextField
        id="city"
        label="City"
        required
        autoComplete="address-level2"
        placeholder="Your city"
        value={values.city}
        error={errors.city}
        onChange={(event) => onChange("city", event.target.value)}
        className="sm:col-span-2"
      />

      <TextField
        id="region"
        label="Region, state or province"
        optional
        autoComplete="address-level1"
        value={values.region}
        error={errors.region}
        onChange={(event) => onChange("region", event.target.value)}
        className="sm:col-span-2"
      />

      <SelectField
        id="ageRange"
        label="Age"
        required
        hint="Used only to understand who the cohort is reaching."
        value={values.ageRange}
        error={errors.ageRange}
        onChange={(event) => onChange("ageRange", event.target.value)}
        className="sm:col-span-2"
      >
        <option value="">Select your age</option>
        {AGE_RANGES.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </SelectField>
    </div>
  );
}

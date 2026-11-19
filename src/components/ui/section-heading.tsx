import { cn } from "@/lib/utils";

export function SectionHeading({
  number,
  eyebrow,
  title,
  intro,
  as: Heading = "h2",
  className,
  titleClassName,
}: {
  number?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  as?: "h2" | "h3";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={cn("max-w-[46rem]", className)}>
      {(eyebrow || number) && (
        <p className="type-label flex items-center gap-3 text-[var(--color-emerald-600)]">
          {number && <span className="tabular-nums">{number}</span>}
          {number && eyebrow && (
            <span aria-hidden className="h-px w-8 bg-[var(--color-emerald-600)/40]" />
          )}
          {eyebrow && <span>{eyebrow}</span>}
        </p>
      )}
      <Heading
        className={cn("type-h2 mt-4 text-[var(--color-ink)]", titleClassName)}
      >
        {title}
      </Heading>
      {intro && (
        <p className="type-lead mt-5 max-w-[38rem] text-[var(--color-ink-subtle)]">{intro}</p>
      )}
    </div>
  );
}
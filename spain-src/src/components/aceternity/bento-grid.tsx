/* Copied from Aceternity UI Bento Grid
   https://ui.aceternity.com/components/bento-grid
   Restyled with the trip tokens. No nested card chrome. */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function BentoGrid({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={cn("mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3", className)}>
      {children}
    </div>
  );
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
}: {
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <article className={cn("flex min-w-0 flex-col justify-between gap-3 border border-line bg-card p-4", className)}>
      {header}
      <div className="min-w-0">
        {title ? <h3 className="font-display text-2xl text-ink">{title}</h3> : null}
        {description ? <p className="mt-1 text-base text-muted">{description}</p> : null}
      </div>
    </article>
  );
}

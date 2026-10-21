import type { ReactNode } from "react";

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-b border-stone-200 px-5 py-5 last:border-b-0">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

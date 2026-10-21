import { ChevronRight } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

export function Faq({ t }: { t: Dictionary }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">{t.faq.title}</h2>
      <div className="bg-card divide-y rounded-xl border">
        {t.faq.items.map((item, index) => (
          <details key={index} className="group">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-medium">
              <ChevronRight className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-90" />
              {item.q}
            </summary>
            <p className="text-muted-foreground px-4 pb-4 pl-10 text-sm break-keep">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

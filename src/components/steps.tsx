import { ImageIcon } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

/** 사용 방법 단계. 스크린샷은 아직 자리만 둔다. */
export function Steps({ t }: { t: Dictionary }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">{t.steps.title}</h2>
      <ol className="grid gap-4 sm:grid-cols-2">
        {t.steps.items.map((step, index) => (
          <li key={index} className="bg-card flex flex-col gap-3 rounded-xl border p-4">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                {index + 1}
              </span>
              <h3 className="font-semibold break-keep">{step.title}</h3>
            </div>
            <p className="text-muted-foreground text-sm break-keep">{step.body}</p>
            <div className="text-muted-foreground bg-muted/50 flex aspect-video items-center justify-center gap-1.5 rounded-lg border border-dashed text-xs">
              <ImageIcon className="size-4" /> {t.steps.screenshot}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

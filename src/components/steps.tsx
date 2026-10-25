import { TriangleAlert } from "lucide-react";
import { STEP_ILLUSTRATIONS } from "@/components/step-illustrations";
import type { Dictionary } from "@/lib/i18n";

/** 사용 방법 단계. 단계마다 화면을 단순하게 옮긴 SVG 그림을 붙인다. */
export function Steps({ t }: { t: Dictionary }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">{t.steps.title}</h2>
      <ol className="flex flex-col gap-4">
        {t.steps.items.map((step, index) => {
          const Illustration = STEP_ILLUSTRATIONS[index];
          return (
            <li key={index} className="bg-card grid items-start gap-4 rounded-xl border p-4 md:grid-cols-[1fr_minmax(0,1.4fr)]">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    {index + 1}
                  </span>
                  <h3 className="font-semibold break-keep">{step.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm break-keep">{step.body}</p>
                {"prompt" in step && step.prompt && (
                  <blockquote className="bg-muted/60 border-primary/50 rounded-md border-l-2 px-3 py-2 text-sm break-keep">
                    {step.prompt}
                  </blockquote>
                )}
                {"warning" in step && step.warning && (
                  <p className="bg-destructive/10 text-destructive flex gap-2 rounded-md p-3 text-sm font-medium break-keep">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                    {step.warning}
                  </p>
                )}
              </div>
              <div className="overflow-hidden rounded-lg border">
                <Illustration l={t.steps.illustration} />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

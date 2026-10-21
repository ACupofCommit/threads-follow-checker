import { ShieldCheck } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

/** 계정 정보를 받지 않고 데이터가 브라우저 밖으로 나가지 않는다는 안내. */
export function SafetyNote({ t }: { t: Dictionary }) {
  return (
    <section className="border-primary/30 bg-primary/5 flex flex-col gap-2 rounded-xl border p-4">
      <h2 className="flex items-center gap-2 font-semibold">
        <ShieldCheck className="text-primary size-5" /> {t.safety.title}
      </h2>
      <ul className="text-muted-foreground flex list-disc flex-col gap-1 pl-7 text-sm break-keep">
        {t.safety.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

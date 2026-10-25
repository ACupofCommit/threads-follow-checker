"use client";

import { useId, useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import { ChevronRight, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format, type Dictionary } from "@/lib/i18n";
import { buildScript, parseKeep } from "@/lib/script";

/** 옵션 폼과, 그 값이 들어간 스크립트의 복사·미리보기. */
export function ScriptBuilder({ t }: { t: Dictionary }) {
  const o = t.options;
  const id = useId();
  const [keepText, setKeepText] = useState("");

  const keep = useMemo(() => parseKeep(keepText), [keepText]);
  const script = buildScript({ keep });

  async function copy() {
    track("script_copy", { keep: keep.length });
    try {
      await navigator.clipboard.writeText(script);
      toast.success(o.copied);
    } catch {
      toast.error(o.copyFailed);
    }
  }

  return (
    <Card id="script">
      <CardHeader>
        <CardTitle className="text-lg">{o.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-keep`}>{o.keepLabel}</Label>
          <p className="text-muted-foreground text-xs sm:text-sm">{o.keepHint}</p>
          <Textarea
            id={`${id}-keep`}
            value={keepText}
            onChange={(event) => setKeepText(event.target.value)}
            placeholder={o.keepPlaceholder}
            spellCheck={false}
            className="min-h-20 font-mono text-sm"
          />
          {keep.length > 0 && <p className="text-muted-foreground text-xs">{format(o.keepCount, { count: keep.length })}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Button size="lg" className="h-11 text-base" onClick={copy}>
            <Copy /> {o.copy}
          </Button>
          <p className="text-muted-foreground text-center text-xs">{o.note}</p>
        </div>

        <details className="group rounded-lg border">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 px-4 py-3 text-sm font-medium">
            <ChevronRight className="size-4 transition-transform group-open:rotate-90" />
            {o.preview}
          </summary>
          <pre className="bg-muted max-h-96 overflow-auto rounded-b-lg border-t p-4 font-mono text-xs leading-relaxed">
            <code>{script}</code>
          </pre>
        </details>
      </CardContent>
    </Card>
  );
}

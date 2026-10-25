"use client";

import { useId, useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import { ChevronRight, Copy, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { format, type Dictionary } from "@/lib/i18n";
import { UNFOLLOW_DELAY_SEC, UNFOLLOW_PER_RUN, buildScript, parseKeep } from "@/lib/script";

/** 옵션 폼과, 그 값이 들어간 스크립트의 복사·미리보기. */
export function ScriptBuilder({ t }: { t: Dictionary }) {
  const o = t.options;
  const id = useId();
  const [keepText, setKeepText] = useState("");
  const [unfollow, setUnfollow] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const keep = useMemo(() => parseKeep(keepText), [keepText]);
  const script = buildScript({ keep, unfollow });
  const limit = { count: UNFOLLOW_PER_RUN, min: UNFOLLOW_DELAY_SEC.min, max: UNFOLLOW_DELAY_SEC.max };

  // 켜는 쪽만 경고를 먼저 확인받는다. 끄는 건 바로 끈다.
  function onUnfollowChange(checked: boolean) {
    if (checked) setConfirmOpen(true);
    else setUnfollow(false);
  }

  async function copy() {
    track("script_copy", { unfollow });
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

        <div className="flex flex-col gap-4 rounded-lg border p-4">
          <span className="text-muted-foreground text-xs font-semibold">{o.advanced}</span>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor={`${id}-unfollow`}>{o.unfollowLabel}</Label>
              <p className="text-muted-foreground text-xs sm:text-sm">{format(o.unfollowHint, limit)}</p>
            </div>
            <Switch id={`${id}-unfollow`} checked={unfollow} onCheckedChange={onUnfollowChange} className="mt-0.5" />
          </div>

          {unfollow && (
            <>
              <div className="bg-destructive/10 text-destructive flex gap-2 rounded-md p-3 text-sm">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                <p className="break-keep">
                  <strong className="font-semibold">{o.warningTitle}.</strong> {format(o.warningBody, limit)}
                </p>
              </div>
              <p className="text-muted-foreground text-sm break-keep">{format(o.limit, limit)}</p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button size="lg" className="h-11 text-base" onClick={copy}>
            <Copy /> {o.copy}
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            {unfollow ? format(o.modeUnfollow, limit) : o.modeList}
          </p>
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

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{o.warningTitle}</AlertDialogTitle>
            <AlertDialogDescription className="break-keep">{format(o.warningBody, limit)}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{o.cancel}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setUnfollow(true);
                setConfirmOpen(false);
              }}
            >
              {o.confirmAction}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

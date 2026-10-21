"use client";

import { track } from "@vercel/analytics";
import { ArrowUpRight } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";

const YOUTUBE_PLAYLIST_MAKER = "https://youtube-playlist-maker.commit2.app";

export function OtherTools({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-muted-foreground text-sm font-semibold">{t.tools.title}</h2>
      <a
        href={`${YOUTUBE_PLAYLIST_MAKER}/${lang}?utm_source=threads-follow-checker`}
        target="_blank"
        rel="noopener"
        onClick={() => track("tool_click", { tool: "youtube-playlist-maker" })}
        className="group bg-card hover:border-foreground/30 flex items-center gap-3 rounded-xl border p-4 transition-colors"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- 다른 사이트의 아이콘이라 최적화 대상이 아니다 */}
        <img src={`${YOUTUBE_PLAYLIST_MAKER}/icon.svg`} alt="" width={36} height={36} className="size-9 rounded-lg" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="font-medium">{t.tools.youtube.name}</span>
          <span className="text-muted-foreground text-sm">{t.tools.youtube.body}</span>
        </div>
        <ArrowUpRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </section>
  );
}

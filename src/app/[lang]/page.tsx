import { Fragment } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Faq } from "@/components/faq";
import { GungyeMeme } from "@/components/gungye-meme";
import { OtherTools } from "@/components/other-tools";
import { PromoSection } from "@/components/promo-section";
import { SafetyNote } from "@/components/safety-note";
import { ScriptBuilder } from "@/components/script-builder";
import { Steps } from "@/components/steps";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <Header lang={lang} t={t} />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-4 pt-10 pb-16 sm:pt-16">
        <section className="flex flex-col gap-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight whitespace-pre-line sm:text-4xl">{t.hero.title}</h1>
          <p className="text-muted-foreground mx-auto max-w-xl text-balance break-keep">{t.hero.subtitle}</p>
          <GungyeMeme line={t.hero.meme} />
        </section>
        <SafetyNote t={t} />
        <Steps t={t} />
        <ScriptBuilder t={t} />
        <Faq t={t} />
        <PromoSection lang={lang} t={t} />
        <OtherTools lang={lang} t={t} />
      </main>
      <footer className="text-muted-foreground border-t py-6 text-center text-xs">
        {t.footer.madeBy.split("{brand}").map((part, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <a href="https://commit2.app/" target="_blank" rel="noopener" className="hover:text-foreground underline underline-offset-2">
                {t.footer.brand}
              </a>
            )}
            {part}
          </Fragment>
        ))}
      </footer>
    </>
  );
}

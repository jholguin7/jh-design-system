"use client";
import { useLang } from "../hooks/use-lang";

export function LanguageToggle() {
  const { lang, setLang, t } = useLang();
  return (
    <button
      type="button"
      aria-label={t("lang.toggle")}
      onClick={() => setLang(lang === "es" ? "en" : "es")}
      className="rounded-md border px-2 py-1 text-xs font-medium uppercase hover:bg-[var(--bg-subtle)]"
    >
      {lang}
    </button>
  );
}

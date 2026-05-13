"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { baseTranslations, type Lang, type TranslationDict } from "../lib/i18n";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<LangCtx | null>(null);
const STORAGE = "jh.lang";

export function I18nProvider({
  children,
  dict = baseTranslations,
  defaultLang = "es",
}: {
  children: ReactNode;
  /** consumer can override or extend by passing `mergeDicts(baseTranslations, myAppDict)` */
  dict?: TranslationDict;
  defaultLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(defaultLang);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE);
    if (stored === "es" || stored === "en") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE, l);
    } catch {
      /* ignore */
    }
  };

  const t = (key: string): string => dict[key]?.[lang] ?? key;

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLang must be used within I18nProvider");
  return c;
}

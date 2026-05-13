export type Lang = "es" | "en";
export type TranslationDict = Record<string, { es: string; en: string }>;

export const baseTranslations: TranslationDict = {
  "common.save": { es: "Guardar", en: "Save" },
  "common.cancel": { es: "Cancelar", en: "Cancel" },
  "common.loading": { es: "Cargando…", en: "Loading…" },
  "common.search": { es: "Buscar", en: "Search" },
  "common.close": { es: "Cerrar", en: "Close" },
  "nav.dashboard": { es: "Panel", en: "Dashboard" },
  "nav.settings": { es: "Configuración", en: "Settings" },
  "nav.admin": { es: "Administración", en: "Admin" },
  "nav.logout": { es: "Cerrar sesión", en: "Log out" },
  "theme.toggle": { es: "Cambiar tema", en: "Toggle theme" },
  "theme.light": { es: "Claro", en: "Light" },
  "theme.dark": { es: "Oscuro", en: "Dark" },
  "lang.toggle": { es: "Cambiar idioma", en: "Change language" },
};

export function mergeDicts(...dicts: TranslationDict[]): TranslationDict {
  return Object.assign({}, ...dicts);
}

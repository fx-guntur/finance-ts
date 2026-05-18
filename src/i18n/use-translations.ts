import { useLocale } from "../providers/locale-provider";
import type { TranslationKey } from "./messages";

export function useTranslations() {
  const { locale, t } = useLocale();

  return {
    locale,
    t: (key: TranslationKey) => t(key),
  };
}

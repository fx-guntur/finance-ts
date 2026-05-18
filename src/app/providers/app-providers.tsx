import type { ReactNode } from "react";
import { LocaleProvider } from "../../providers/locale-provider";
import { ThemeProvider } from "../../providers/theme-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <LocaleProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LocaleProvider>
  );
}

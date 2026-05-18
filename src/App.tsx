import { AppProviders } from "./app/providers/app-providers";
import { AppShell } from "./app/shell/app-shell";

export default function App() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}

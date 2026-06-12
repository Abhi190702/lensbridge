import type { ReactElement } from "react";
import { About } from "./pages/About";
import { Dashboard } from "./pages/Dashboard";
import { Security } from "./pages/Security";
import { Settings } from "./pages/Settings";
import { Sources } from "./pages/Sources";
import { VirtualCamera } from "./pages/VirtualCamera";
import { AppShell, type PageId } from "./components/AppShell";
import { useDesktopReceiver } from "./hooks/useDesktopEvents";
import { usePairing } from "./hooks/usePairing";

export default function App() {
  const pairing = usePairing();
  const receiver = useDesktopReceiver(pairing.session);
  const pages: Record<PageId, ReactElement> = {
    dashboard: <Dashboard pairing={pairing} receiver={receiver} />,
    sources: <Sources />,
    virtualCamera: <VirtualCamera />,
    security: <Security session={pairing.session} />,
    settings: <Settings />,
    about: <About />
  };

  return (
    <AppShell status={receiver.status} metrics={receiver.metrics}>
      {(page) => pages[page]}
    </AppShell>
  );
}

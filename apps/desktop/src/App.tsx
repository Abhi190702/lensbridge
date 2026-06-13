import { useEffect, useState, type ReactElement } from "react";
import { LogicalSize } from "@tauri-apps/api/dpi";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { About } from "./pages/About";
import { Dashboard } from "./pages/Dashboard";
import { Security } from "./pages/Security";
import { Settings } from "./pages/Settings";
import { Sources } from "./pages/Sources";
import { VirtualCamera } from "./pages/VirtualCamera";
import { AppShell, type PageId } from "./components/AppShell";
import { ObsOutputWindow } from "./components/ObsOutputWindow";
import { useDesktopReceiver } from "./hooks/useDesktopEvents";
import { usePairing } from "./hooks/usePairing";
import { useUnityCaptureBridge } from "./hooks/useUnityCaptureBridge";
import { OBS_OUTPUT_TITLE } from "./lib/obsWorkflow";

export default function App() {
  const pairing = usePairing();
  const receiver = useDesktopReceiver(pairing.session);
  const directCamera = useUnityCaptureBridge(receiver.remoteStream, false);
  const [page, setPage] = useState<PageId>("dashboard");
  const [obsOutputOpen, setObsOutputOpen] = useState(false);

  useEffect(() => {
    const title = obsOutputOpen ? OBS_OUTPUT_TITLE : "LensBridge Desktop";
    document.title = title;

    async function applyWindowMode() {
      const appWindow = getCurrentWindow();
      await appWindow.setTitle(title);

      if (obsOutputOpen) {
        await appWindow.setAlwaysOnTop(true);
        await appWindow.setMinSize(new LogicalSize(960, 540));
        await appWindow.setSize(new LogicalSize(1280, 720));
        await appWindow.center();
        await appWindow.setFocus();
        return;
      }

      await appWindow.setAlwaysOnTop(false);
      await appWindow.setMinSize(new LogicalSize(960, 640));
    }

    try {
      void applyWindowMode().catch(() => undefined);
    } catch {
      // Browser-only dev preview does not expose Tauri window metadata.
    }
  }, [obsOutputOpen]);

  if (obsOutputOpen) {
    return <ObsOutputWindow stream={receiver.remoteStream} onExit={() => setObsOutputOpen(false)} />;
  }

  const pages: Record<PageId, ReactElement> = {
    dashboard: (
      <Dashboard
        pairing={pairing}
        receiver={receiver}
        directCamera={directCamera}
        onOpenObsOutput={() => setObsOutputOpen(true)}
        onOpenGuide={() => setPage("virtualCamera")}
      />
    ),
    sources: <Sources />,
    virtualCamera: <VirtualCamera directCamera={directCamera} />,
    security: <Security session={pairing.session} />,
    settings: <Settings />,
    about: <About />
  };

  return (
    <AppShell page={page} onNavigate={setPage} status={receiver.status} metrics={receiver.metrics}>
      {(page) => pages[page]}
    </AppShell>
  );
}

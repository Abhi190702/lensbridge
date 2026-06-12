import { useState, type ReactElement } from "react";
import type { ConnectionStatus, StreamMetrics } from "@lensbridge/shared";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { StatusBar } from "./StatusBar";

export type PageId = "dashboard" | "sources" | "virtualCamera" | "security" | "settings" | "about";

interface AppShellProps {
  children: (page: PageId) => ReactElement;
  status: ConnectionStatus;
  metrics: Partial<StreamMetrics>;
}

export function AppShell({ children, status, metrics }: AppShellProps) {
  const [page, setPage] = useAppPage();

  return (
    <div className="flex h-screen w-screen overflow-hidden text-slate-100">
      <Sidebar active={page} onNavigate={setPage} />
      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar status={status} metrics={metrics} />
        <section className="lb-scrollbar min-h-0 flex-1 overflow-auto px-6 py-5">{children(page)}</section>
        <StatusBar status={status} metrics={metrics} />
      </main>
    </div>
  );
}

function useAppPage(): [PageId, (page: PageId) => void] {
  const [page, setPage] = useState<PageId>("dashboard");
  return [page, setPage];
}

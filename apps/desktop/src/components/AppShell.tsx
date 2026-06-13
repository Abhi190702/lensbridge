import type { ReactElement } from "react";
import type { ConnectionStatus, StreamMetrics } from "@lensbridge/shared";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { StatusBar } from "./StatusBar";

export type PageId = "dashboard" | "sources" | "virtualCamera" | "security" | "settings" | "about";

interface AppShellProps {
  children: (page: PageId) => ReactElement;
  page: PageId;
  onNavigate: (page: PageId) => void;
  status: ConnectionStatus;
  metrics: Partial<StreamMetrics>;
}

export function AppShell({ children, page, onNavigate, status, metrics }: AppShellProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden text-slate-100">
      <Sidebar active={page} onNavigate={onNavigate} />
      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar page={page} status={status} metrics={metrics} />
        <section className="lb-scrollbar min-h-0 flex-1 overflow-auto px-5 py-4">{children(page)}</section>
        <StatusBar status={status} metrics={metrics} />
      </main>
    </div>
  );
}

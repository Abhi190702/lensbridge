import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/Button";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-100">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <div className="font-medium">Something needs attention</div>
          <p className="mt-1 text-red-100/80">{message}</p>
          {onRetry ? (
            <Button className="mt-4" variant="secondary" onClick={onRetry}>
              Retry
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  label: string;
  current: number;
  target: number;
  formatValue: (n: number) => string;
}

export function ProgressBar({ label, current, target, formatValue }: ProgressBarProps) {
  const pct = Math.min((current / target) * 100, 100);
  const isAhead = current >= target;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {formatValue(current)} / {formatValue(target)}
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isAhead ? "bg-green-500" : "bg-blue-500"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{pct.toFixed(1)}% 달성</span>
        {!isAhead && <span>{formatValue(target - current)} 남음</span>}
        {isAhead && <span className="text-green-600">목표 달성!</span>}
      </div>
    </div>
  );
}

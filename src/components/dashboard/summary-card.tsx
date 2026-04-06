"use client";

import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
}

const trendConfig = {
  up: { icon: ArrowUp, className: "text-green-600" },
  down: { icon: ArrowDown, className: "text-red-600" },
  neutral: { icon: Minus, className: "text-muted-foreground" },
} as const;

export function SummaryCard({
  title,
  value,
  subValue,
  trend,
  trendLabel,
}: SummaryCardProps) {
  const trendInfo = trend ? trendConfig[trend] : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subValue && (
          <p className="text-sm text-muted-foreground">{subValue}</p>
        )}
        {trendInfo && (
          <div className={cn("mt-1 flex items-center gap-1 text-xs", trendInfo.className)}>
            <trendInfo.icon className="h-3 w-3" />
            {trendLabel && <span>{trendLabel}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

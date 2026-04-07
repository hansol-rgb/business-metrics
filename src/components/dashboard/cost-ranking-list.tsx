"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatKRW } from "@/lib/format";

interface CostItem {
  name: string;
  amount: number;
  category: string;
}

interface CostRankingListProps {
  items: CostItem[];
  maxAmount: number;
}

export function CostRankingList({ items, maxAmount }: CostRankingListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          돈으로 나간 비용 (YTD 금액 순)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => {
          const pct = (item.amount / maxAmount) * 100;
          return (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-right text-muted-foreground font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium">{item.name}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {item.category}
                  </Badge>
                </div>
                <span className="font-semibold tabular-nums">
                  {formatKRW(item.amount)}
                </span>
              </div>
              <div className="ml-7 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-neutral-500 dark:bg-neutral-400"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
